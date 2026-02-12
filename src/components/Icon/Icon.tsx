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
  faInbox,
  faCircleQuestion,
  faGear,
  faPenToSquare,
  faFaceSmile,
  faArrowUpFromBracket,
  faTableCells,
  faFolder,
  faChevronDown,
  faChevronRight,
  faChevronLeft,
  faChevronUp,
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
  faEyeSlash,
  faUsers,
  faCirclePlus,
  faBullseye,
  faBullhorn,
  faClipboard,
  faCompass,
  faEye,
  faTemperatureHalf,
  faStar,
  faCircleXmark,
  faPiggyBank,
  faComputer,
  faPassport,
  faPhone,
  faCircle,
  faCheck,
  faAngleLeft,
  faHouse,
  faLaptop,
  faSpinner,
  faArrowLeft,
  faRotateLeft,
  faClockRotateLeft,
  faBold,
  faItalic,
  faUnderline,
  faListUl,
  faListOl,
  faList,
  faCopy,
  faComment,
  faKeyboard,
  faLightbulb,
  faSitemap,
  faUserTie,
  faUser,
  faChartSimple,
  faTextHeight,
  faListCheck,
  faFilePen,
  faBolt,
  faHand,
  faUserPlus,
  faShieldHeart,
  faPlay,
  faTable,
  faClipboardList,
  faClipboardCheck,
  faChartBar,
  faCodeBranch,
  faArrowRight,
  faBriefcase,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import {
  faCircleUser as faCircleUserRegular,
  faFileLines as faFileLinesRegular,
  faFaceSmile as faFaceSmileRegular,
  faFolder as faFolderRegular,
  faIdBadge as faIdBadgeRegular,
  faCalendar as faCalendarRegular,
  faClock as faClockRegular,
  faCircle as faCircleRegular,
  faCircleQuestion as faCircleQuestionRegular,
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
  Grid2x2Plus,
  Inbox,
  Settings,
  CirclePlus,
  Zap,
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
  | 'inbox'
  | 'circle-question'
  | 'gear'
  | 'pen-to-square'
  | 'face-smile'
  | 'arrow-up-from-bracket'
  | 'table-cells'
  | 'folder'
  | 'chevron-down'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-up'
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
  | 'file-export'
  | 'sparkles'
  | 'paperclip'
  | 'microphone'
  | 'expand'
  | 'compress'
  | 'down-left-and-up-right-to-center'
  | 'xmark'
  | 'circle-arrow-up'
  | 'paper-plane'
  | 'eye-slash'
  | 'users'
  | 'circle-plus'
  | 'circle-plus-lined'
  | 'bullseye'
  | 'bullhorn'
  | 'clipboard'
  | 'compass'
  | 'eye'
  | 'temperature-half'
  | 'star'
  | 'circle-x'
  | 'piggy-bank'
  | 'computer'
  | 'megaphone'
  | 'passport'
  | 'phone'
  | 'circle'
  | 'check'
  | 'grid-2-plus'
  | 'angle-left'
  | 'house'
  | 'laptop'
  | 'house-building'
  | 'house-laptop'
  | 'spinner'
  | 'arrow-left'
  | 'rotate-left'
  | 'clock-rotate-left'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'list-ul'
  | 'list-ol'
  | 'list'
  | 'copy'
  | 'comment'
  | 'keyboard'
  | 'lightbulb'
  | 'sitemap'
  | 'user-tie'
  | 'user'
  | 'chart-simple'
  | 'text-size'
  | 'clipboard-list'
  | 'clipboard-check'
  | 'chart-bar'
  | 'code-branch'
  | 'arrow-right'
  | 'briefcase'
  | 'download';

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
  'id-badge-regular': faIdBadgeRegular,
  'chart-pie-simple': faChartPie,
  'file-lines': faFileLines,
  'file-lines-regular': faFileLinesRegular,
  'circle-dollar': faDollarSign,
  'magnifying-glass': faMagnifyingGlass,
  'inbox': faInbox,
  'circle-question': faCircleQuestion,
  'circle-question-regular': faCircleQuestionRegular,
  'gear': faGear,
  'pen-to-square': faPenToSquare,
  'face-smile': faFaceSmile,
  'face-smile-regular': faFaceSmileRegular,
  'arrow-up-from-bracket': faArrowUpFromBracket,
  'table-cells': faTableCells,
  'folder': faFolder,
  'folder-regular': faFolderRegular,
  'chevron-down': faChevronDown,
  'chevron-right': faChevronRight,
  'chevron-left': faChevronLeft,
  'chevron-up': faChevronUp,
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
  'clock-regular': faClockRegular,
  'wrench': faWrench,
  'calendar': faCalendar,
  'calendar-regular': faCalendarRegular,
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
  'eye-slash': faEyeSlash,
  'users': faUsers,
  'circle-plus': faCirclePlus,
  'bullseye': faBullseye,
  'bullhorn': faBullhorn,
  'clipboard': faClipboard,
  'compass': faCompass,
  'eye': faEye,
  'temperature-half': faTemperatureHalf,
  'star': faStar,
  'circle-x': faCircleXmark,
  'piggy-bank': faPiggyBank,
  'computer': faComputer,
  'megaphone': faBullhorn,
  'passport': faPassport,
  'phone': faPhone,
  'circle': faCircle,
  'circle-regular': faCircleRegular,
  'check': faCheck,
  'angle-left': faAngleLeft,
  'house': faHouse,
  'laptop': faLaptop,
  'house-building': faBuilding,
  'house-laptop': faLaptop,
  'spinner': faSpinner,
  'arrow-left': faArrowLeft,
  'rotate-left': faRotateLeft,
  'clock-rotate-left': faClockRotateLeft,
  'bold': faBold,
  'italic': faItalic,
  'underline': faUnderline,
  'list-ul': faListUl,
  'list-ol': faListOl,
  'list': faList,
  'copy': faCopy,
  'comment': faComment,
  'keyboard': faKeyboard,
  'lightbulb': faLightbulb,
  'sitemap': faSitemap,
  'user-tie': faUserTie,
  'user': faUser,
  'chart-simple': faChartSimple,
  'text-size': faTextHeight,
  'list-check': faListCheck,
  'file-pen': faFilePen,
  'bolt': faBolt,
  'hand': faHand,
  'user-plus': faUserPlus,
  'shield-heart': faShieldHeart,
  'play': faPlay,
  'table': faTable,
  'clipboard-list': faClipboardList,
  'clipboard-check': faClipboardCheck,
  'chart-bar': faChartBar,
  'code-branch': faCodeBranch,
  'arrow-right': faArrowRight,
  'briefcase': faBriefcase,
  'download': faDownload,
} as const;

export function Icon({ name, size = 24, className = '', variant = 'solid', style }: IconProps) {
  // Handle Lucide icons (for expand/collapse)
  if (name === 'arrow-right-from-line') {
    return (
      <PanelLeftOpen
        size={size}
        className={className}
        strokeWidth={2.25}
      />
    );
  }

  if (name === 'arrow-left-from-line') {
    return (
      <PanelLeftClose
        size={size}
        className={className}
        strokeWidth={2.25}
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
    return <Sun size={size} className={className} strokeWidth={2.25} />;
  }

  if (name === 'moon') {
    return <Moon size={size} className={className} strokeWidth={2.25} />;
  }

  if (name === 'zoom-in') {
    return <ZoomIn size={size} className={className} strokeWidth={1.5} />;
  }

  if (name === 'zoom-out') {
    return <ZoomOut size={size} className={className} strokeWidth={1.5} />;
  }

  if (name === 'file-export') {
    // Use arrow-up-from-bracket as export icon
    return <FontAwesomeIcon icon={faArrowUpFromBracket} fontSize={size} className={className} />;
  }

  if (name === 'grid-2-plus') {
    return <Grid2x2Plus size={size} className={className} strokeWidth={2.5} style={style} />;
  }

  if (name === 'circle-plus-lined') {
    return <CirclePlus size={size} className={className} strokeWidth={1.5} style={style} />;
  }

  // Handle icons that need Lucide for regular variant
  if (name === 'inbox' && variant === 'regular') {
    return <Inbox size={size} className={className} strokeWidth={2.25} style={style} />;
  }

  if (name === 'gear' && variant === 'regular') {
    return <Settings size={size} className={className} strokeWidth={2.25} style={style} />;
  }

  if (name === 'home' && variant === 'regular') {
    return <Home size={size} className={className} strokeWidth={2.25} style={style} />;
  }

  if (name === 'user-group' && variant === 'regular') {
    return <Users size={size} className={className} strokeWidth={2.25} style={style} />;
  }

  if (name === 'chart-pie-simple' && variant === 'regular') {
    return <PieChart size={size} className={className} strokeWidth={2.25} style={style} />;
  }

  if (name === 'bolt' && variant === 'regular') {
    return <Zap size={size} className={className} strokeWidth={2.25} style={style} />;
  }

  if (name === 'bolt' && variant === 'solid') {
    return <Zap size={size} className={className} strokeWidth={2.25} fill="currentColor" style={style} />;
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
