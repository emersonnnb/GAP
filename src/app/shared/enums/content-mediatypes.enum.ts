// Application
export enum ContentApplicationMediaTypesEnum {
  JAVA_ARCHIVE = 'application/java-archive',
  EDI_X12 = 'application/EDI-X12',
  EDIFACT = 'application/EDIFACT',
  JAVASCRIPT = 'application/javascript',
  OCTET_STREAM = 'application/octet-stream',
  OGG = 'application/ogg',
  PDF = 'application/pdf',
  XHTML_XML = 'application/xhtml+xml',
  X_SHOCKWAVE_FLASH = 'application/x-shockwave-flash',
  JSON = 'application/json',
  LD_JSON = 'application/ld+json',
  XML = 'application/xml',
  ZIP = 'application/zip',
  X_WWW_FORM_URLENCODED = 'application/x-www-form-urlencoded',
  ALL = 'application/*'
}

export type ContentApplicationMediaTypes =
  `${ContentApplicationMediaTypesEnum}`;

// Audio
export enum ContentAudioMediaTypesEnum {
  MPEG = 'audio/mpeg',
  X_MS_WMA = 'audio/x-ms-wma',
  VND_RN_REALAUDIO = 'audio/vnd.rn-realaudio',
  X_WAV = 'audio/x-wav',
  ALL = 'audio/*'
}

export type ContentAudioMediaTypes = `${ContentAudioMediaTypesEnum}`;

// Image
export enum ContentImageMediaTypesEnum {
  GIF = 'image/gif',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  BMP = 'image/bmp',
  TIFF = 'image/tiff',
  VND_MICROSOFT_ICON = 'image/vnd.microsoft.icon',
  X_ICON = 'image/x-icon',
  VND_DJVU = 'image/vnd.djvu',
  SVG_XML = 'image/svg+xml',
  ALL = 'image/*'
}

export type ContentImageMediaTypes = `${ContentImageMediaTypesEnum}`;

// Multipart
export enum ContentMultipartMediaTypesEnum {
  MIXED = 'multipart/mixed',
  ALTERNATIVE = 'multipart/alternative',
  RELATED = 'multipart/related',
  FORM_DATA = 'multipart/form-data',
  ALL = 'multipart/*'
}

export type ContentMultipartMediaTypes = `${ContentMultipartMediaTypesEnum}`;

// Text
export enum ContentTextMediaTypesEnum {
  CSS = 'text/css',
  CSV = 'text/csv',
  HTML = 'text/html',
  PLAIN = 'text/plain',
  XML = 'text/xml',
  ALL = 'text/*'
}

export type ContentTextMediaTypes = `${ContentTextMediaTypesEnum}`;

// Video
export enum ContentVideoMediaTypesEnum {
  MPEG = 'video/mpeg',
  MP4 = 'video/mp4',
  QUICKTIME = 'video/quicktime',
  X_MS_WMV = 'video/x-ms-wmv',
  X_MSVIDEO = 'video/x-msvideo',
  X_FLV = 'video/x-flv',
  WEBM = 'video/webm',
  ALL = 'video/*'
}

export type ContentVideoMediaTypes = `${ContentVideoMediaTypesEnum}`;

// Vnd
export enum ContentVndMediaTypesEnum {
  ANDROID_PACKAGE_ARCHIVE = 'application/vnd.android.package-archive',
  OASIS_OPENDOCUMENT_TEXT = 'application/vnd.oasis.opendocument.text',
  OASIS_OPENDOCUMENT_SPREADSHEET = 'application/vnd.oasis.opendocument.spreadsheet',
  OASIS_OPENDOCUMENT_PRESENTATION = 'application/vnd.oasis.opendocument.presentation',
  OASIS_OPENDOCUMENT_GRAPHICS = 'application/vnd.oasis.opendocument.graphics',
  MS_EXCEL = 'application/vnd.ms-excel',
  OPENXMLFORMATS_OFFICEDOCUMENT_SPREADSHEETML_SHEET = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  MS_POWERPOINT = 'application/vnd.ms-powerpoint',
  OPENXMLFORMATS_OFFICEDOCUMENT_PRESENTATIONML_PRESENTATION = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  MSWORD = 'application/msword',
  OPENXMLFORMATS_OFFICEDOCUMENT_WORDPROCESSINGML_DOCUMENT = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  MOZILLA_XUL_XML = 'application/vnd.mozilla.xul+xml'
}

export type ContentVndMediaTypes = `${ContentVndMediaTypesEnum}`;

// All
export enum AllMediaTypesEnum {
  ALL = '*/*'
}

export type AllMediaTypes = `${AllMediaTypesEnum}`;

export type ContentMediaTypes =
  | ContentApplicationMediaTypes
  | ContentAudioMediaTypes
  | ContentImageMediaTypes
  | ContentMultipartMediaTypes
  | ContentTextMediaTypes
  | ContentVideoMediaTypes
  | ContentVndMediaTypes
  | AllMediaTypes;
