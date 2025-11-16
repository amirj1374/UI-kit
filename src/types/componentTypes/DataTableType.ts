export interface DataTableType {
  header?: IHeader[];
  dialog?: boolean;
  dialogDelete?: boolean;
  data?: [];
  editedIndex?: number;
}

export interface IHeader {
  title: string,
  align: 'start'| 'center' | 'end',
  sortable: boolean,
  key: string,
}
