export const ROUTES = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: '	fa fa-cube',
    class: '',
    role: '',
    params: '',
    show: true,
    items: [],
  },
  {
    path: '/notF',
    title: 'Sản phẩm',
    icon: '	fa fa-cubes',
    class: '',
    role: 'admin',
    params: '',
    show: true,
    items: [
      {
        path: '/kho/quan-ly-san-pham',
        title: 'Quản lý sản phẩm',
        icon: '',
        class: '',
        role: 'admin',
        params: { shopCode: 'KHBOM' },
      },
      {
        path: '/kho/nhap-hang',
        title: 'Nhập hàng',
        icon: '',
        class: '',
        role: 'admin',
        params: { shopCode: 'KHBOM' },
      },
      {
        path: '/kho/xuat-hang',
        title: 'Xuất hàng',
        icon: '',
        class: '',
        role: 'admin',
        params: { shopCode: 'KHBOM' },
      },
      {
        path: '/kho/hang-loi',
        title: 'Hàng lỗi',
        icon: '',
        class: '',
        role: 'admin',
        params: { shopCode: 'KHBOM' },
      },
      {
        path: '/d',
        title: 'Kiểm hàng',
        icon: '',
        class: '',
        role: 'admin',
        params: { shopCode: 'KHBOM' },
      },
      {
        path: '/kho/lich-su-xuat-nhap',
        title: 'Lịch sử xuất nhập',
        icon: '',
        class: '',
        role: 'admin',
        params: { shopCode: 'KHBOM' },
      },
    ],
  },
  {
    path: '/notF',
    title: 'Đơn hàng',
    icon: 'fa fa-archive',
    class: '',
    role: 'admin',
    params: '',
    show: true,
    items: [
      {
        path: '/data',
        title: 'Đơn hàng',
        icon: 'nc-basket',
        class: '',
        role: 'user',
        params: { shopCode: 'KHBOM' },
      },
      {
        path: '/notF',
        title: 'Danh sách hàng hoàn',
        icon: 'nc-basket',
        class: '',
        role: 'user',
        params: { shopCode: 'KHBOM' },
      },
      {
        path: '/notF',
        title: 'Đã in đơn',
        icon: 'nc-basket',
        class: '',
        role: 'user',
        params: { shopCode: 'KHBOM' },
      },
    ],
  },
  {
    path: '/notF',
    title: 'Nhân viên',
    icon: 'fa fa-user',
    class: '',
    role: 'user',
    params: '',
    show: true,
    items: [
      {
        path: '/work',
        title: 'Chấm công',
        icon: 'nc-basket',
        class: '',
        role: 'user',
        params: '',
        data: {
          code: 'work',
        },
      },
      {
        path: '/account',
        title: 'Nhân viên',
        icon: 'nc-basket',
        class: '',
        role: 'user',
        params: { shopCode: 'KHBOM' },
        data: {
          code: 'account',
        },
      },
    ],
  },
  {
    path: '/notF',
    title: 'Đối tác',
    icon: '	fa fa-handshake-o',
    class: '',
    role: '',
    params: '',
    show: true,
    items: [
      {
        path: '/notF',
        title: 'Khách hàng',
        icon: 'nc-basket',
        class: '',
        role: '',
        params: '',
      },
      {
        path: '/notF',
        title: 'Nhà cung cấp',
        icon: 'nc-basket',
        class: '',
        role: '',
        params: '',
      },
    ],
  },
  {
    path: '/notF',
    title: 'Thu chi',
    icon: 'fa fa-laptop',
    class: '',
    role: '',
    params: '',
    show: true,
    items: [
      {
        path: '/cost-type',
        title: 'Loại chi phí',
        icon: 'nc-basket',
        class: '',
        role: 'admin',
        params: '',
      },
      {
        path: '/cost',
        title: 'Bản ghi chi phí',
        icon: 'nc-basket',
        class: '',
        role: 'admin',
        params: '',
      },
      {
        path: '/cost-marketing',
        title: 'Chi phí marketing',
        icon: 'nc-basket',
        class: '',
        role: 'marketing',
        params: '',
      },
    ],
  },
  {
    path: '/notF',
    title: 'Báo cáo',
    icon: '	fa fa-pie-chart',
    class: '',
    role: '',
    params: '',
    show: true,
    items: [
      {
        path: '/utm-statistic',
        title: 'Thống kê UTM',
        icon: 'nc-basket',
        class: '',
        role: 'marketing',
        params: '',
      },
      {
        path: '/statiscal-revenue',
        title: 'Thống kê doanh thu',
        icon: 'nc-basket',
        class: '',
        role: 'admin',
        params: '',
      },
      {
        path: '/statiscal-cost',
        title: 'Thống kê chi phí',
        icon: 'nc-basket',
        class: '',
        role: 'admin',
        params: '',
      },
      {
        path: '/statistic-performance-sale',
        title: 'Thống kê hiệu suất sale',
        icon: 'nc-basket',
        class: '',
        role: 'admin',
        params: '',
      },
      {
        path: '/order',
        title: 'Thống kê đơn hàng',
        icon: 'nc-basket',
        class: '',
        role: 'admin',
        params: '',
      },
      {
        path: '/notF',
        title: 'Thống kê sản phẩm',
        icon: 'nc-basket',
        class: '',
        role: '',
        params: '',
      },
      {
        path: '/notF',
        title: 'Thống kê vận chuyển',
        icon: 'nc-basket',
        class: '',
        role: '',
        params: '',
      },
      {
        path: '/calllogs',
        title: 'Thống kê cuộc gọi',
        icon: 'nc-basket',
        class: '',
        role: 'admin',
        params: '',
      },
      {
        path: '/notF',
        title: 'Tài chính tổng hợp',
        icon: 'nc-basket',
        class: '',
        role: '',
        params: '',
      },
    ],
  },
  {
    path: '/notF',
    title: 'Cấu hình',
    icon: '	fa fa-cog',
    class: '',
    role: '',
    params: '',
    show: true,
    items: [
      {
        path: '/utm-medium',
        title: 'Cấu hình UTM',
        icon: 'nc-basket',
        class: '',
        role: 'marketing',
        params: '',
      },
      {
        path: '/kho/quan-ly-kho',
        title: 'Cấu hình Kho',
        icon: '',
        class: '',
        role: 'admin',
        params: { shopCode: 'KHBOM' },
      },
      {
        path: '/config',
        title: 'Cấu hình',
        icon: 'nc-basket',
        class: '',
        role: 'admin',
        params: '',
      },
      {
        path: '/order-config',
        title: 'Cấu hình đơn hàng',
        icon: 'nc-basket',
        class: '',
        role: 'admin',
        params: '',
      },
      {
        path: '/notF',
        title: 'Cấu hình chi phí',
        icon: 'nc-basket',
        class: '',
        role: '',
        params: '',
      },
      {
        path: '/notF',
        title: 'Cấu hình phân quyền',
        icon: 'nc-basket',
        class: '',
        role: '',
        params: '',
      },
      {
        path: '/notF',
        title: 'Danh mục sản phẩm',
        icon: 'nc-basket',
        class: '',
        role: '',
        params: '',
      },
      {
        path: '/setting-shipping',
        title: 'Đơn vị vận chuyển',
        icon: 'nc-basket',
        class: '',
        role: 'admin',
        params: '',
      },
    ],
  },
];
