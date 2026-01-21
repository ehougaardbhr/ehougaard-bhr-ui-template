import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faCircleUser,
  faUserGroup,
  faIdBadge,
  faChartPie,
  faFileLines,
  faDollarSign,
  faMagnifyingGlass,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faInbox,
  faCircleQuestion,
  faGear,
  faPenToSquare,
  faFaceSmile,
  faArrowUpFromBracket,
  faTableCells,
  faFolder,
  faChevronDown,
  faChevronUp,
  faChevronRight,
  faArrowDown,
  faTrashCan,
  faFile,
  faFileAudio,
  faImage,
  faCircleInfo,
  faBuilding,
  faMobileScreen,
  faEnvelope,
  faClock,
  faWrench,
  faCalendar,
  faEllipsis,
  faPen,
  faLocationDot,
  faAddressCard,
  faCaretDown,
  faLock,
  faThumbsUp,
  faHeart,
  faSliders,
  faBell,
  faSpa,
  faPalette,
  faDoorOpen,
  faRightToBracket,
  faChartLine,
  faPlane,
  faGraduationCap,
  faShield,
  faCheckCircle,
  faLink,
  faArrowsRotate,
  faWandMagicSparkles,
  faPaperclip,
  faMicrophone,
  faExpand,
  faCompress,
  faDownLeftAndUpRightToCenter,
  faXmark,
  faCircleArrowUp,
  faPaperPlane,
  faArrowLeft,
  faArrowUp,
  faCheck,
  faChartSimple,
  faTable,
  faCopy,
  faBold,
  faItalic,
  faUnderline,
  faListUl,
  faListOl,
  faSitemap,
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import {
  faCircleUser as faCircleUserRegular,
  faFileLines as faFileLinesRegular,
  faFaceSmile as faFaceSmileRegular,
  faFolder as faFolderRegular,
} from '@fortawesome/free-regular-svg-icons';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Home,
  UserCircle,
  Users,
  IdCard,
  PieChart,
  FileText,
  CircleDollarSign,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

export type IconName =
  | 'home'
  | 'circle-user'
  | 'user-group'
  | 'id-badge'
  | 'chart-pie-simple'
  | 'file-lines'
  | 'circle-dollar'
  | 'arrow-right-from-line'
  | 'arrow-left-from-line'
  | 'magnifying-glass'
  | 'magnifying-glass-plus'
  | 'magnifying-glass-minus'
  | 'inbox'
  | 'circle-question'
  | 'gear'
  | 'pen-to-square'
  | 'face-smile'
  | 'arrow-up-from-bracket'
  | 'table-cells'
  | 'folder'
  | 'chevron-down'
  | 'chevron-up'
  | 'chevron-right'
  | 'arrow-down-to-line'
  | 'trash-can'
  | 'file'
  | 'file-audio'
  | 'image'
  | 'circle-info'
  | 'building'
  | 'mobile'
  | 'envelope'
  | 'clock'
  | 'wrench'
  | 'calendar'
  | 'linkedin'
  | 'ellipsis'
  | 'pen'
  | 'location-dot'
  | 'address-card'
  | 'caret-down'
  | 'lock'
  | 'thumbs-up'
  | 'heart'
  | 'sliders'
  | 'bell'
  | 'spa'
  | 'palette'
  | 'door-open'
  | 'door-closed'
  | 'chart-line'
  | 'plane'
  | 'graduation-cap'
  | 'shield'
  | 'check-circle'
  | 'link'
  | 'arrows-rotate'
  | 'home-lucide'
  | 'user-circle-lucide'
  | 'users-lucide'
  | 'id-card-lucide'
  | 'pie-chart-lucide'
  | 'file-text-lucide'
  | 'circle-dollar-lucide'
  | 'sun'
  | 'moon'
  | 'zoom-in'
  | 'zoom-out'
  | 'sparkles'
  | 'paperclip'
  | 'microphone'
  | 'expand'
  | 'compress'
  | 'down-left-and-up-right-to-center'
  | 'xmark'
  | 'circle-arrow-up'
  | 'paper-plane'
  | 'arrow-left'
  | 'arrow-up'
  | 'check'
  | 'chart-simple'
  | 'table'
  | 'copy'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'list-ul'
  | 'list-ol'
  | 'sitemap';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  variant?: 'solid' | 'regular';
  style?: React.CSSProperties;
}

const faIconMap = {
  'home': faHome,
  'circle-user': faCircleUser,
  'circle-user-regular': faCircleUserRegular,
  'user-group': faUserGroup,
  'id-badge': faIdBadge,
  'chart-pie-simple': faChartPie,
  'file-lines': faFileLines,
  'file-lines-regular': faFileLinesRegular,
  'circle-dollar': faDollarSign,
  'magnifying-glass': faMagnifyingGlass,
  'magnifying-glass-plus': faMagnifyingGlassPlus,
  'magnifying-glass-minus': faMagnifyingGlassMinus,
  'inbox': faInbox,
  'circle-question': faCircleQuestion,
  'gear': faGear,
  'pen-to-square': faPenToSquare,
  'face-smile': faFaceSmile,
  'face-smile-regular': faFaceSmileRegular,
  'arrow-up-from-bracket': faArrowUpFromBracket,
  'table-cells': faTableCells,
  'folder': faFolder,
  'folder-regular': faFolderRegular,
  'chevron-down': faChevronDown,
  'chevron-up': faChevronUp,
  'chevron-right': faChevronRight,
  'arrow-down-to-line': faArrowDown,
  'trash-can': faTrashCan,
  'file': faFile,
  'file-audio': faFileAudio,
  'image': faImage,
  'circle-info': faCircleInfo,
  'building': faBuilding,
  'mobile': faMobileScreen,
  'envelope': faEnvelope,
  'clock': faClock,
  'wrench': faWrench,
  'calendar': faCalendar,
  'linkedin': faLinkedin,
  'ellipsis': faEllipsis,
  'pen': faPen,
  'location-dot': faLocationDot,
  'address-card': faAddressCard,
  'caret-down': faCaretDown,
  'lock': faLock,
  'thumbs-up': faThumbsUp,
  'heart': faHeart,
  'sliders': faSliders,
  'bell': faBell,
  'spa': faSpa,
  'palette': faPalette,
  'door-open': faDoorOpen,
  'door-closed': faRightToBracket,
  'chart-line': faChartLine,
  'plane': faPlane,
  'graduation-cap': faGraduationCap,
  'shield': faShield,
  'check-circle': faCheckCircle,
  'link': faLink,
  'arrows-rotate': faArrowsRotate,
  'sparkles': faWandMagicSparkles,
  'paperclip': faPaperclip,
  'microphone': faMicrophone,
  'expand': faExpand,
  'compress': faCompress,
  'down-left-and-up-right-to-center': faDownLeftAndUpRightToCenter,
  'xmark': faXmark,
  'circle-arrow-up': faCircleArrowUp,
  'paper-plane': faPaperPlane,
  'arrow-left': faArrowLeft,
  'arrow-up': faArrowUp,
  'check': faCheck,
  'chart-simple': faChartSimple,
  'table': faTable,
  'copy': faCopy,
  'bold': faBold,
  'italic': faItalic,
  'underline': faUnderline,
  'list-ul': faListUl,
  'list-ol': faListOl,
  'sitemap': faSitemap,
} as const;

export function Icon({ name, size = 24, className = '', variant = 'solid', style }: IconProps) {
  // Handle Lucide icons (for expand/collapse)
  if (name === 'arrow-right-from-line') {
    return (
      <PanelLeftOpen
        size={size}
        className={className}
        strokeWidth={1.5}
      />
    );
  }

  if (name === 'arrow-left-from-line') {
    return (
      <PanelLeftClose
        size={size}
        className={className}
        strokeWidth={1.5}
      />
    );
  }

  // Handle Lucide nav icons
  if (name === 'home-lucide') {
    return <Home size={size} className={className} strokeWidth={1.5} />;
  }

  if (name === 'user-circle-lucide') {
    return <UserCircle size={size} className={className} strokeWidth={1.5} />;
  }

  if (name === 'users-lucide') {
    return <Users size={size} className={className} strokeWidth={1.5} />;
  }

  if (name === 'id-card-lucide') {
    return <IdCard size={size} className={className} strokeWidth={1.5} />;
  }

  if (name === 'pie-chart-lucide') {
    return <PieChart size={size} className={className} strokeWidth={1.5} />;
  }

  if (name === 'file-text-lucide') {
    return <FileText size={size} className={className} strokeWidth={1.5} />;
  }

  if (name === 'circle-dollar-lucide') {
    return <CircleDollarSign size={size} className={className} strokeWidth={1.5} />;
  }

  if (name === 'sun') {
    return <Sun size={size} className={className} strokeWidth={1.5} />;
  }

  if (name === 'moon') {
    return <Moon size={size} className={className} strokeWidth={1.5} />;
  }

  if (name === 'zoom-in') {
    return <ZoomIn size={size} className={className} strokeWidth={1.5} />;
  }

  if (name === 'zoom-out') {
    return <ZoomOut size={size} className={className} strokeWidth={1.5} />;
  }

  // Handle Font Awesome icons
  const iconKey = variant === 'regular' && `${name}-regular` in faIconMap
    ? `${name}-regular` as keyof typeof faIconMap
    : name as keyof typeof faIconMap;

  const icon = faIconMap[iconKey];

  if (!icon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <FontAwesomeIcon
      icon={icon}
      style={{ width: size, height: size, ...style }}
      className={className}
    />
  );
}

export default Icon;
