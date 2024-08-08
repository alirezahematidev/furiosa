import { Observable, observable } from '@legendapp/state';
import { ObservablePersistLocalStorage, ObservablePersistSessionStorage } from '@legendapp/state/persist-plugins/local-storage';
import { synced } from '@legendapp/state/sync';
import { AxiosHeaderValue, AxiosInstance } from 'axios';
import * as jose from 'jose';

type Maybe<T> = T | null;

type Payload = {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
};

type User = {
  [key: string]: any;
  readonly sub: string;
  exp?: number;
};

type PersistOptions = {
  key?: string;
  scope?: string;
  strategy?: 'localstorage' | 'sessionstorage';
};

type AuthorizeCallback = <T extends User>(user: T) => Promise<Payload>;

type DefaultHeaders = {
  headers?: { [key: string]: AxiosHeaderValue };
};

type AuthOptions = {
  authorize: AuthorizeCallback;
  persistOptions?: PersistOptions;
  onAfterSignIn?: (payload: Payload) => void | Promise<void>;
  onAfterSignOut?: () => void | Promise<void>;
};

class Auth<T extends User> {
  private token$: Observable<Maybe<Payload>>;

  private clear: (() => void) | null = null;

  constructor(private readonly options: AuthOptions) {
    this.token$ = observable<Maybe<Payload>>(synced({ initial: null, persist: { ...this.persist(options.persistOptions) } }));

    this._bind();
  }

  private _bind() {
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.persist = this.persist.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  private persist({ key = 'token', strategy = 'localstorage', scope }: PersistOptions = {}) {
    const name = scope ? scope + ':' + key : key;

    const plugin = strategy === 'sessionstorage' ? ObservablePersistSessionStorage : ObservablePersistLocalStorage;

    return { name, plugin };
  }

  private tryOverrideTokenExpiration(payload: Payload, user: T) {
    if (payload.expiresIn) return;

    const expiresIn = user['exp'] || user['iat'];

    if (expiresIn && typeof expiresIn === 'number') {
      this.token$.expiresIn.set(expiresIn);

      payload.expiresIn = expiresIn;
    }
  }

  private bearer(token: string) {
    return `Bearer ${token.trim()}`;
  }

  public getUser(): Promise<Maybe<T>> {
    return new Promise((resolve, reject) => {
      try {
        const payload = this.token$.get();

        if (payload) {
          const data = jose.decodeJwt(payload.accessToken) as T;

          resolve(data ?? null);
        }

        resolve(null);
      } catch (error) {
        reject(error);
      }
    });
  }

  public async signIn(user: T) {
    try {
      const payload = await this.options.authorize(user);

      if (!payload) return console.error('The authorize callback returns some invalid data');

      this.token$.set(payload);

      console.log('The user has been set successfully');

      await this.options.onAfterSignIn?.(payload);
    } catch (error) {
      console.error(error);
    }
  }

  public async signOut() {
    this.token$.delete();

    if (this.clear) this.clear();

    await this.options.onAfterSignOut?.();
  }

  public async checkAccessTokenIsExpired(handleRefreshToken: (refreshToken: string) => Promise<Payload>) {
    const payload = this.token$.get();

    if (!payload || !payload.accessToken) return;

    const data = jose.decodeJwt(payload.accessToken) as T;

    if (!data) return;

    this.tryOverrideTokenExpiration(payload, data);

    if (payload.expiresIn && Date.now() > payload.expiresIn) {
      try {
        const freshData = await handleRefreshToken(payload.refreshToken);

        if (freshData) this.token$.set(freshData);
      } catch (error) {
        console.error(error);

        if (this.clear) this.clear();

        this.token$.delete();
      }
    }
  }

  public setAuthorization({ headers }: DefaultHeaders) {
    headers = headers ?? {};

    const accessToken = this.token$.accessToken.get();

    if (accessToken) headers['authorization'] = this.bearer(accessToken);
  }

  public applyAxiosMiddleware(axiosInstance: AxiosInstance, handleRefreshToken?: (refreshToken: string) => Promise<Payload>) {
    const accessToken = this.token$.accessToken.get();

    if (accessToken) axiosInstance.defaults.headers.common['authorization'] = this.bearer(accessToken);

    axiosInstance.interceptors.request.use((config) => {
      if (accessToken) config.headers['authorization'] = this.bearer(accessToken);

      return config;
    });

    axiosInstance.interceptors.response.use(async (response) => {
      const accessToken = this.token$.accessToken.get();

      if (accessToken) response.config.headers['authorization'] = this.bearer(accessToken);

      // * UNAUTHORIZED STATUS = 401
      if (response.status === 401 && handleRefreshToken) {
        try {
          await this.checkAccessTokenIsExpired(handleRefreshToken);
        } catch (error) {
          //
        }
      }

      return response;
    });

    this.clear = () => {
      axiosInstance.interceptors.request.clear();
      axiosInstance.interceptors.response.clear();
    };
  }
}

export { Auth };
