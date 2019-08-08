export const groupG = /[А-Яа-я]{1,6}-\d{2}-\d|\d{2}ИП-.{1,6}/gi;
export const date = /(\d{2})\.(\d{2})\.(\d{2})/i;
export const classroom = /(А|М|У|П|Ин|О|Б|Л|С)[ -]?\d{1,3}(а|б)?| /;
export const teacher = /[А-ЯЁ][а-яё]{2,} {1,2}[А-ЯЁ][а-яё]?\.[А-ЯЁ]\.?/;
