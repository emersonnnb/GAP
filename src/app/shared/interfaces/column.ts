import { ColumnTypeEnum } from '../enums/column-type-enum';
import { TitleTypeEnum } from '../enums/title-type-enum';

export interface Column {
  name: string;
  title: string;
  type?: ColumnTypeEnum;
  titleType?: TitleTypeEnum;
  width?: string;
  columnAttrs?: { [key: string]: any };
  headerAttrs?: { [key: string]: any };
  titleIconAttrs?: { [key: string]: any };
  sortColumn?: string;
}
