import { theme } from 'style/theme';

export const DownArrowIcon = ({ ...props }) => {
  return (
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6 7.51279L0 1.51279L1.4 0.112793L6 4.71279L10.6 0.112793L12 1.51279L6 7.51279Z"
        fill={theme.colors.white80}
      />
    </svg>
  );
};
