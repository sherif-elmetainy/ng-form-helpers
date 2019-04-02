import * as Globalize from 'globalize';

import likelySubtags from 'cldr-data/supplemental/likelySubtags.json';
import numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import currencyData from 'cldr-data/supplemental/currencyData.json';
import metaZones from 'cldr-data/supplemental/metaZones.json';
import timeData from 'cldr-data/supplemental/timeData.json';
import weekData from 'cldr-data/supplemental/weekData.json';

import calendarDe from 'cldr-data/main/de/ca-gregorian.json';
import currencyDe from 'cldr-data/main/de/currencies.json';
import numbersDe from 'cldr-data/main/de/numbers.json';
import timeZonesDe from 'cldr-data/main/de/timeZoneNames.json';
import posixDe from 'cldr-data/main/de/posix.json';

import calendarEn from 'cldr-data/main/en-GB/ca-gregorian.json';
import currencyEn from 'cldr-data/main/en-GB/currencies.json';
import numbersEn from 'cldr-data/main/en-GB/numbers.json';
import timeZonesEn from 'cldr-data/main/en-GB/timeZoneNames.json';
import posixEn from 'cldr-data/main/en-GB/posix.json';

import calendarAr from 'cldr-data/main/ar-EG/ca-gregorian.json';
import currencyAr from 'cldr-data/main/ar-EG/currencies.json';
import numbersAr from 'cldr-data/main/ar-EG/numbers.json';
import timeZonesAr from 'cldr-data/main/ar-EG/timeZoneNames.json';
import posixAr from 'cldr-data/main/ar-EG/posix.json';

export function loadGlobalizeData() {

    Globalize.load(likelySubtags);
    Globalize.load(numberingSystems);
    Globalize.load(currencyData);
    Globalize.load(metaZones);
    Globalize.load(timeData);
    Globalize.load(weekData);

    Globalize.load(calendarDe);
    Globalize.load(numbersDe);
    Globalize.load(currencyDe);
    Globalize.load(timeZonesDe);
    Globalize.load(posixDe);

    Globalize.load(calendarEn);
    Globalize.load(numbersEn);
    Globalize.load(currencyEn);
    Globalize.load(timeZonesEn);
    Globalize.load(posixEn);

    Globalize.load(calendarAr);
    Globalize.load(numbersAr);
    Globalize.load(currencyAr);
    Globalize.load(timeZonesAr);
    Globalize.load(posixAr);
}
