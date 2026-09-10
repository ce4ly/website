import {
  AcademicCapIcon,
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  Bars3Icon,
  BookOpenIcon,
  CalculatorIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  FlagIcon,
  HomeIcon,
  InformationCircleIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MoonIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  PlayCircleIcon,
  RssIcon,
  ShieldExclamationIcon,
  SignalIcon,
  SignalSlashIcon,
  SunIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const ICONOS = {
  acerca: InformationCircleIcon,
  antenas: SignalIcon,
  boletines: RssIcon,
  calculadora: CalculatorIcon,
  calendario: CalendarDaysIcon,
  chevron: ChevronDownIcon,
  contacto: EnvelopeIcon,
  convertir: ArrowsRightLeftIcon,
  cursos: AcademicCapIcon,
  directo: ArrowRightIcon,
  directiva: SignalIcon,
  emergencias: ShieldExclamationIcon,
  enviar: PaperAirplaneIcon,
  error: ExclamationTriangleIcon,
  herramientas: WrenchScrewdriverIcon,
  inicio: HomeIcon,
  libro: BookOpenIcon,
  lista: ListBulletIcon,
  lupa: MagnifyingGlassIcon,
  mapa: MapPinIcon,
  menu: Bars3Icon,
  mision: FlagIcon,
  luna: MoonIcon,
  play: PlayCircleIcon,
  rss: RssIcon,
  siguiente: ChevronRightIcon,
  senal: SignalIcon,
  sinconexion: SignalSlashIcon,
  sol: SunIcon,
  telefono: PhoneIcon,
  ubicacion: MapPinIcon,
  usuarios: UserGroupIcon,
  cerrar: XMarkIcon
}

const Icono = ({ nombre, className = 'size-4 shrink-0' }) => {
  const Cmp = ICONOS[nombre]
  if (!Cmp) return null
  return <Cmp className={className} aria-hidden="true" />
}

export default Icono
