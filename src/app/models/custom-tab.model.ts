export interface CustomTabModel {
  key: string;
  label: string;
  icon?: string;  
  action?: {
    label: string;
    icon?: string;
    tooltip?: string;
  };
}
