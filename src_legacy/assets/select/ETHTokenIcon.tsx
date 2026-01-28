import { theme } from 'style/theme';

export const ETHTokenIcon = ({ ...props }) => {
  return (
    <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="32" height="32" rx="16" fill={theme.colors.white15} fillOpacity="0.976471" />
      <path
        d="M20.7469 16.15L16 19.05L11.25 16.15L16 8L20.7469 16.15ZM16 19.9812L11.25 17.0813L16 24L20.75 17.0813L16 19.9812Z"
        fill={theme.colors.black5}
      />
    </svg>
  );
};
