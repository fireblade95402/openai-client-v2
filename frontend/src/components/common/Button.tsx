import { CommandBarButton, DefaultButton, IButtonProps, IButtonStyles, ICommandBarStyles } from "@fluentui/react";

import styles from './Button.module.css';

interface ButtonProps extends IButtonProps {
  onClick: () => void;
  text: string | undefined;
}

export const ShareButton: React.FC<ButtonProps> = ({ onClick, text }) => {

  return (
    <CommandBarButton
      className={styles.shareButtonRoot}
      iconProps={{ iconName: 'Share' }}
      onClick={onClick}
      text={text}
    />
  )
}

export const HistoryButton: React.FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <DefaultButton
      className={styles.historyButtonRoot}
      text={text}
      iconProps={{ iconName: 'History' }}
      onClick={onClick}
    />
  )
 
}

interface SystemButtonProps extends IButtonProps {
  onClick: () => void;
}

export const SystemButton: React.FC<SystemButtonProps> = ({onClick}) => {
  const SystemButtonStyles: ICommandBarStyles & IButtonStyles = {
      root: {
        width: 86,
        height: 32,
        borderRadius: 4,
        background: 'radial-gradient(109.81% 107.82% at 100.1% 90.19%, #175ea1 33.63%, #4F88BD 70.31%, #b3d6f3 100%)',
      //   position: 'absolute',
      //   right: 20,
        padding: '5px 12px',
        marginRight: '20px'
      },
      icon: {
        color: '#FFFFFF',
      },
      rootHovered: {
        background: 'linear-gradient(135deg, #b3d6f3 0%, #4F88BD 51.04%, #175ea1 100%)',
      },
      label: {
        fontWeight: 600,
        fontSize: 14,
        lineHeight: '20px',
        color: '#FFFFFF',
      },
    };

    return (
      <CommandBarButton
              styles={SystemButtonStyles}
              iconProps={{ iconName: 'System' }}
              onClick={onClick}
              text="System"
      />
    )
}