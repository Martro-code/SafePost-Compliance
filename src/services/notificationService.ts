import { supabase } from './supabaseClient';

/** IDs of all hardcoded notifications in the app */
const ALL_NOTIFICATION_IDS = [1, 2, 3];

/** Fetch the IDs of notifications the user has already read. */
export async function fetchReadNotificationIds(userId: string): Promise<number[]> {
  const { data, error } = await supabase
    .from('notification_reads')
    .select('notification_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching notification reads:', error);
    return [];
  }

  return data.map((row: { notification_id: number }) => row.notification_id);
}

/** Mark a single notification as read for the given user. */
export async function markNotificationRead(userId: string, notificationId: number): Promise<void> {
  const { error } = await supabase
    .from('notification_reads')
    .upsert(
      { user_id: userId, notification_id: notificationId },
      { onConflict: 'user_id,notification_id' }
    );

  if (error) {
    console.error('Error marking notification as read:', error);
  }
}

/** Mark all notifications as read for the given user. */
export async function markAllNotificationsRead(userId: string): Promise<void> {
  const rows = ALL_NOTIFICATION_IDS.map(id => ({
    user_id: userId,
    notification_id: id,
  }));

  const { error } = await supabase
    .from('notification_reads')
    .upsert(rows, { onConflict: 'user_id,notification_id' });

  if (error) {
    console.error('Error marking all notifications as read:', error);
  }
}

/** Get the count of unread notifications for the given user. */
export async function getUnreadCount(userId: string): Promise<number> {
  const readIds = await fetchReadNotificationIds(userId);
  return ALL_NOTIFICATION_IDS.length - readIds.length;
}
