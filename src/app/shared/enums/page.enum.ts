import { Order } from "./order.enum";


export interface IPage {
  pageStart: number;
  pageSize: number;
  pageOrder?: Order;
  pageSort?: unknown;
}

export enum PageEnum {
  PAGE_START = 'pageStart',
  PAGE_SIZE = 'pageSize',
  PAGE_ORDER = 'pageOrder',
  PAGE_SORT = 'pageSort'
}

export type Page = IPage;
