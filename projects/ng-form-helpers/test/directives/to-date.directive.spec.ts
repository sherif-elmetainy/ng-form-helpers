import { TestBed, ComponentFixture } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { AngularGlobalizeModule, CANG_SUPPORTED_CULTURES, CurrentCultureService, GlobalizationService } from '@code-art/angular-globalize';
import { By } from '@angular/platform-browser';
import { ToDateDirective } from '../../src/lib';
import { loadGlobalizeData } from '../globalize-data-loader';

const testDate1 = new Date(2001, 0, 1);
const testDate2 = new Date(1999, 11, 31);
@Component({
    template: `
    <input type="text" frmToDate [formControl]="formControl" />
  `
})
class TestComponent {
    public formControl: FormControl;

    constructor(formBuilder: FormBuilder) {
        this.formControl = formBuilder.control(testDate1);
    }
}

describe('ToDateDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let testDate1En = '';
    let testDate2En = '';
    let testDate2De = '';
    let testDate2Ar = '';
    beforeEach(() => {
        loadGlobalizeData();
        TestBed.configureTestingModule({
            declarations: [ToDateDirective, TestComponent],
            imports: [FormsModule, ReactiveFormsModule, AngularGlobalizeModule.forRoot()],
            providers: [
                { provide: CANG_SUPPORTED_CULTURES, useValue: ['en-GB', 'ar', 'de'] }
            ]
        });

        fixture = TestBed.createComponent<TestComponent>(TestComponent);
        component = fixture.componentInstance;
        const converter = TestBed.get(GlobalizationService) as GlobalizationService;
        testDate1En = converter.formatDate(testDate1, 'en-GB', {
          datetime: 'short',
        });
        testDate2En = converter.formatDate(testDate2, 'en-GB', {
          datetime: 'short',
        });
        testDate2De = converter.formatDate(testDate2, 'de', {
          datetime: 'short',
        });
        testDate2Ar = converter.formatDate(testDate2, 'ar', {
          datetime: 'short',
        });
    });

    it('updates model to null when input has empty string', async () => {
        expect(component.formControl.value).toEqual(testDate1);
        const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
        fixture.detectChanges();
        expect(input.value).toBe(testDate1En);
        input.value = '';
        input.dispatchEvent(new Event('input'));
        expect(component.formControl.value).toBe(null);
    });

    it('updates model to value when input changes', async () => {
        expect(component.formControl.value).toEqual(testDate1);
        const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
        fixture.detectChanges();
        expect(input.value).toEqual(testDate1En);
        input.value = testDate2En;
        input.dispatchEvent(new Event('input'));
        expect(component.formControl.value).toEqual(testDate2);
    });

    it('updates input format when culture changes', async () => {
        const cultureService = TestBed.get(CurrentCultureService) as CurrentCultureService;
        cultureService.currentCulture = 'en-GB';
        expect(component.formControl.value).toBe(testDate1);
        const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
        fixture.detectChanges();
        expect(input.value).toBe(testDate1En);
        input.value = testDate2En;
        input.dispatchEvent(new Event('input'));
        expect(component.formControl.value).toEqual(testDate2);

        cultureService.currentCulture = 'de-DE';
        expect(input.value).toBe(testDate2De);
        cultureService.currentCulture = 'ar-EG';
        expect(input.value).toBe(testDate2Ar);
        cultureService.currentCulture = 'en-GB';
        expect(input.value).toBe(testDate2En);
    });

    it('updates model with string values when input has invalid date', async () => {
        const cultureService = TestBed.get(CurrentCultureService) as CurrentCultureService;
        cultureService.currentCulture = 'en-GB';
        expect(component.formControl.value).toBe(testDate1);
        const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
        fixture.detectChanges();
        expect(input.value).toBe(testDate1En);
        input.value = 'A';
        input.dispatchEvent(new Event('input'));
        expect(component.formControl.value).toBe('A');
        input.value = testDate2Ar;
        input.dispatchEvent(new Event('input'));
        expect(component.formControl.value).toBe(testDate2Ar);
        cultureService.currentCulture = 'ar-EG';
        expect(component.formControl.value).toEqual(testDate2);
    });

    it('updates disabled state', () => {
        const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
        component.formControl.disable();
        fixture.detectChanges();
        expect(input.disabled).toBe(true);
        component.formControl.enable();
        fixture.detectChanges();
        expect(input.disabled).toBe(false);
      });

      it('raises touch events', async () => {
        const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
        fixture.detectChanges();
        expect(component.formControl.touched).toBe(false);
        input.dispatchEvent(new Event('blur'));
        expect(component.formControl.touched).toBe(true);
      });
});
