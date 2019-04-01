import { MessageService } from './message.service';
import { TestBed } from '@angular/core/testing';
import { sentenceCase } from 'change-case';
import { first } from 'rxjs/operators';
import { AngularGlobalizeModule, CANG_SUPPORTED_CULTURES, CurrentCultureService, GlobalizationService } from '@code-art/angular-globalize';

import { loadGlobalizeData } from '../../../test/globalize-data-loader';
import { NgFormHelpersModule } from '../../ng-form-helpers.module';
import { FormValidationContext, FormFieldContext } from '../../form-models';
import { DEFAULT_VALIDATION_MESSAGES } from './validation-messages';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    loadGlobalizeData();
    TestBed.configureTestingModule({
      imports: [NgFormHelpersModule, AngularGlobalizeModule.forRoot()],
      providers: [
        { provide: CANG_SUPPORTED_CULTURES, useValue: ['en-GB', 'ar', 'de'] }
      ],
    });
    service = TestBed.get(MessageService) as MessageService;
  });

  function toString(p: any): string {
    return p !== null && p !== undefined ? p + '' : '';
  }

  function getMessage(key: string, p1: any, p2: any): string {
    const f = DEFAULT_VALIDATION_MESSAGES[key];
    return f.replace('{key}', toString(p1)).replace(`{${key}}`, toString(p2));
  }

  it('returns plain message', async () => {
    expect(await service.getMessage({
      messageKey: 'helloWorld',
    }).pipe(first()).toPromise()).toBe('Hello world');
  });

  it('returns plain message with context', async () => {
    expect(await service.getMessage({
      messageKey: 'email',
      context: FormValidationContext,
    }).pipe(first()).toPromise()).toBe(DEFAULT_VALIDATION_MESSAGES.email);
  });

  it('returns formatted message with context', async () => {
    const key = 'min';
    const field = 'customerAge';
    const val = 1.1;
    const ob$ = service.getMessage({
      messageKey: key,
      context: FormValidationContext,
      parameters: {
        min: val,
        key: {
          messageKey: 'customerAge',
          context: FormFieldContext,
        },
      },
    });
    const cultureService = TestBed.get(CurrentCultureService) as CurrentCultureService;
    const globalizationService = TestBed.get(GlobalizationService) as GlobalizationService;
    cultureService.currentCulture = 'en-GB';
    let res: string | undefined;
    const sub = ob$.subscribe((v) => res = v);
    expect(res).toBe(getMessage(key, sentenceCase(field), globalizationService.formatNumber(val)));
    cultureService.currentCulture = 'ar';
    expect(res).toBe(getMessage(key, sentenceCase(field), globalizationService.formatNumber(val)));
    cultureService.currentCulture = 'de';
    expect(res).toBe(getMessage(key, sentenceCase(field), globalizationService.formatNumber(val)));
    sub.unsubscribe();
  });
});
