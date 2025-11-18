export interface MenuItem {
    header?: string
    title?: string
    icon?: object | any
    to?: string
    divider?: boolean
    chip?: string
    chipColor?: string
    chipVariant?: string
    chipIcon?: string
    children?: MenuItem[]
    disabled?: boolean
    type?: string
    subCaption?: string
    permissionKey?: string
  }

export interface HeaderAction {
    title: string
    icon?: any
    variant?: 'flat' | 'text' | 'elevated' | 'outlined' | 'plain' | 'tonal'
    color?: string
    to?: string
    href?: string
    action?: () => void
    disabled?: boolean
  }