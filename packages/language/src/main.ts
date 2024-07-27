import { observable, syncState } from '@legendapp/state';
import { useSelector } from '@legendapp/state/react';
import { synced } from '@legendapp/state/sync';
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage';

if (typeof window === 'undefined') throw new Error('CANNOT USE THIS PACKAGE IN SERVER');

function initial() {
  if (typeof navigator === 'undefined') return '_unknown';

  const preferredLocale = navigator.language;

  const availableLocales = navigator.languages || [];

  const [locale] = (preferredLocale || availableLocales[0]).split('-');

  return (locale || '_unknown').toLowerCase();
}

const locale$ = observable(synced({ initial: initial(), activate: 'lazy', persist: { name: 'LOCALE', retrySync: true, plugin: ObservablePersistLocalStorage } }));

type Translations = {
  [key: string]: string | Translations;
};

type TranslationSchema<T extends Translations> = {
  [locale in string]: T;
};

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

function changeLocale(locale: string) {
  locale$.set(locale);
}

function getLocale() {
  return locale$.peek();
}

function useLocale() {
  return useSelector(() => locale$.get());
}

const status$ = syncState(locale$);

function isLocaleLoaded() {
  return status$.isLoaded.get();
}

function isLocaleSynced() {
  return status$.isPersistLoaded.get();
}

function clear() {
  return status$.clearPersist();
}

function defineTranslator<T extends Prettify<Translations>>(schema: TranslationSchema<T>, fallbackLocale: keyof TranslationSchema<T>) {
  if (!locale$.get()) locale$.set(fallbackLocale);

  function translate(key: keyof T) {
    const currentLocale = locale$.get();

    const locale = currentLocale ?? fallbackLocale;

    return schema[locale][key];
  }

  return translate;
}

export { changeLocale, defineTranslator, useLocale, getLocale, isLocaleLoaded, isLocaleSynced, clear };
