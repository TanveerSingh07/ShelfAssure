import { FlaskConicalIcon, HistoryIcon, LayersIcon, LayoutDashboardIcon, MessagesSquareIcon } from 'lucide-react';
import type { View } from '../types/navigation';

export const navItems: {view: View;label: string;icon: typeof LayersIcon;}[] = [
{ view: 'overview', label: 'Overview', icon: LayoutDashboardIcon },
{ view: 'analyze', label: 'New analysis', icon: FlaskConicalIcon },
{ view: 'materials', label: 'Materials library', icon: LayersIcon },
{ view: 'history', label: 'Saved analyses', icon: HistoryIcon },
{ view: 'assistant', label: 'Ask ShelfAssure', icon: MessagesSquareIcon }];