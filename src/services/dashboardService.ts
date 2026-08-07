import { apiRequest } from './httpClient';
import { DashboardData } from '../Types';

export function getDashboard() { return apiRequest<DashboardData>('/api/Dashboard'); }