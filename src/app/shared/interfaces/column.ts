import { ColumnTypeEnum } from '../enum/column-type-enum';
import { TitleTypeEnum } from '../enum/title-type-enum';

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
