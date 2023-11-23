import { theme } from 'style/theme';

export const ETHIcon = ({ ...props }) => {
  return (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect y="0.84375" width="24" height="24" rx="12" fill={theme.colors.white15} />
      <path
        d="M15.5602 12.9562L12 15.1313L8.4375 12.9562L12 6.84375L15.5602 12.9562ZM12 15.8297L8.4375 13.6547L12 18.8438L15.5625 13.6547L12 15.8297Z"
        fill={theme.colors.black5}
      />
    </svg>
  );
};
