
// Utility to track views per user to prevent spam
export class ViewTracker {
  private static getStorageKey(type: 'marketplace' | 'forum', itemId: string): string {
    return `viewed_${type}_${itemId}`;
  }

  private static getUserSessionId(): string {
    let sessionId = sessionStorage.getItem('user_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('user_session_id', sessionId);
    }
    return sessionId;
  }

  static hasViewed(type: 'marketplace' | 'forum', itemId: string): boolean {
    const key = this.getStorageKey(type, itemId);
    const sessionId = this.getUserSessionId();
    const viewedSessions = JSON.parse(localStorage.getItem(key) || '[]');
    return viewedSessions.includes(sessionId);
  }

  static markAsViewed(type: 'marketplace' | 'forum', itemId: string): void {
    const key = this.getStorageKey(type, itemId);
    const sessionId = this.getUserSessionId();
    const viewedSessions = JSON.parse(localStorage.getItem(key) || '[]');
    
    if (!viewedSessions.includes(sessionId)) {
      viewedSessions.push(sessionId);
      localStorage.setItem(key, JSON.stringify(viewedSessions));
    }
  }

  static getViewCount(type: 'marketplace' | 'forum', itemId: string): number {
    const key = this.getStorageKey(type, itemId);
    const viewedSessions = JSON.parse(localStorage.getItem(key) || '[]');
    return viewedSessions.length;
  }
}
