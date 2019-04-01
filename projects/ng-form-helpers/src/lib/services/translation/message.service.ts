import { Injectable, Inject } from '@angular/core';
import { CurrentCultureService, StringFormatterService } from '@code-art/angular-globalize';
import { Observable, isObservable, of, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { TranslationServiceInjectionToken, ITranslationService } from './translation.service';
import { ParameterizedMessage, Dictionary } from '../../form-models';
const formatMatchRx = /(?<!\{)(\{)([a-zA-Z_][a-zA-Z0-9_]*)(\:[^\}]+)?(\})/g;
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(
    private readonly stringFormatterService: StringFormatterService,
    private readonly cultureService: CurrentCultureService,
    @Inject(TranslationServiceInjectionToken) private readonly translationService: ITranslationService,
  ) {
  }

  public getMessageWithLanguage(lang: string, messageInfo: ParameterizedMessage): Observable<string> {
    const messageFormat$ = this.translationService.getMessageString(lang, messageInfo.messageKey, messageInfo.context);
    if (!messageInfo.parameters || messageInfo.parameters.length === 0) {
      return messageFormat$;
    }
    const params: Dictionary<any> = messageInfo.parameters;
    if (!this.hasObservable(params)) {
      return messageFormat$.pipe(
        map((f) => this.formatMessage(f, lang, params)),
      );
    }
    const ps$ = this.toDictionaryObservable(params, lang);
    const ob$ = combineLatest(messageFormat$, ps$);
    return ob$.pipe(
      map(([f, p]) => this.formatMessage(f, lang, p)),
    );
  }

  public getMessage(messageInfo: ParameterizedMessage): Observable<string> {
    return this.cultureService.cultureObservable.pipe(
      switchMap((l) => this.getMessageWithLanguage(l, messageInfo)),
    );
  }

  private formatMessage(format: string, lang: string, params: Dictionary<any>): string {
    const keymap: string[] = [];
    const args: any[] = [];
    const newFormat = format.replace(formatMatchRx, (_, p1, p2, p3, p4) => {
      let index = keymap.indexOf(p2);
      if (index < 0) {
        keymap.push(p2);
        args.push(params[p2]);
        index = keymap.length - 1;
      }
      return p1 + index.toString() + (p3 || '') + p4;
    });
    return this.stringFormatterService.formatStringWithLocale(newFormat, lang, ...args);
  }

  private toDictionaryObservable(params: Dictionary<any>, lang: string): Observable<Dictionary<any>> {
    const allKeys = Object.getOwnPropertyNames(params);
    const keys = allKeys.filter((k) => this.isObservableOrParameterizedMessage(params[k]));
    const obsAr = keys.map((k) => this.toObservable(params[k], lang));
    const obs$ = combineLatest(...obsAr)
      .pipe(map((res) => {
        const out: Dictionary<any> = {};
        for (const key of allKeys) {
          const index = keys.indexOf(key);
          if (index < 0) {
            out[key] = params[key];
          } else {
            out[key] = res[index];
          }
        }
        return out;
      }));
    return obs$;
  }

  private toObservable(o: any, lang: string): Observable<any> {
    if (isObservable(o)) {
      return o;
    } else if (this.isParameterizedMessage(o)) {
      return this.getMessageWithLanguage(lang, o);
    }
    return o;
  }

  private hasObservable(params: Dictionary<any>): boolean {
    return !!Object.getOwnPropertyNames(params).find((k) => this.isObservableOrParameterizedMessage(params[k]));
  }

  private isObservableOrParameterizedMessage(o: any): boolean {
    return isObservable(o) || this.isParameterizedMessage(o);
  }

  private isParameterizedMessage(o: any): o is ParameterizedMessage {
    if (o === null || o === undefined || typeof o !== 'object') {
      return false;
    }
    const pm = o as ParameterizedMessage;
    if (typeof pm.messageKey !== 'string') {
      return false;
    }
    if (pm.context !== undefined && typeof pm.context !== 'string') {
      return false;
    }
    if (pm.parameters !== undefined && typeof pm.parameters !== 'object') {
      return false;
    }
    return true;
  }
}
