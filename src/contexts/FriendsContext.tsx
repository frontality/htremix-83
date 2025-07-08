
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Friend {
  id: string;
  username: string;
  email: string;
  status: 'online' | 'offline';
  created_at: string;
}

interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  created_at: string;
}

interface FriendsContextType {
  friends: Friend[];
  friendRequests: FriendRequest[];
  pendingRequests: Friend[];
  sentRequests: Friend[];
  sendFriendRequest: (userId: string, username?: string) => Promise<boolean>;
  acceptFriendRequest: (requestId: string) => Promise<boolean>;
  rejectFriendRequest: (requestId: string) => Promise<boolean>;
  declineFriendRequest: (requestId: string) => Promise<boolean>;
  removeFriend: (friendId: string) => Promise<boolean>;
  blockUser: (userId: string) => Promise<boolean>;
  unblockUser: (userId: string) => Promise<boolean>;
  areFriends: (userId: string) => boolean;
  hasPendingRequest: (userId: string) => boolean;
  loading: boolean;
  refreshFriends: () => Promise<void>;
}

const _ctx = createContext<FriendsContextType | undefined>(undefined);

export const FriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [_f, _sf] = useState<Friend[]>([]);
  const [_fr, _sfr] = useState<FriendRequest[]>([]);
  const [_pr, _spr] = useState<Friend[]>([]);
  const [_sr, _ssr] = useState<Friend[]>([]);
  const [_l, _sl] = useState(false);

  const _gul = () => {
    try {
      const _au = localStorage.getItem('registered_users');
      return _au ? JSON.parse(_au) : [];
    } catch (_e) {
      return [];
    }
  };

  const _gfl = () => {
    try {
      const _fd = localStorage.getItem('friends');
      return _fd ? JSON.parse(_fd) : [];
    } catch (_e) {
      return [];
    }
  };

  const _gfrl = () => {
    try {
      const _rd = localStorage.getItem('friend_requests');
      return _rd ? JSON.parse(_rd) : [];
    } catch (_e) {
      return [];
    }
  };

  const _sfl = (_fd: any[]) => {
    try {
      localStorage.setItem('friends', JSON.stringify(_fd));
    } catch (_e) {}
  };

  const _sfrl = (_rd: any[]) => {
    try {
      localStorage.setItem('friend_requests', JSON.stringify(_rd));
    } catch (_e) {}
  };

  const _af = (_uid: string): boolean => {
    if (!user) return false;
    return _f.some(_fr => _fr.id === _uid);
  };

  const _hpr = (_uid: string): boolean => {
    if (!user) return false;
    const _req = _gfrl();
    return _req.some((_r: any) => 
      (_r.fromUserId === user.id && _r.toUserId === _uid) ||
      (_r.fromUserId === _uid && _r.toUserId === user.id)
    );
  };

  const _rf = async () => {
    if (!user) {
      _sf([]);
      _sfr([]);
      _spr([]);
      _ssr([]);
      return;
    }

    _sl(true);
    try {
      const _fd = _gfl();
      const _rd = _gfrl();
      const _ul = _gul();

      const _uf = _fd.filter((_f: any) => 
        (_f.user1_id === user.id || _f.user2_id === user.id) && _f.status === 'accepted'
      );

      const _ir = _rd.filter((_req: any) => 
        _req.toUserId === user.id
      );

      const _or = _rd.filter((_req: any) => 
        _req.fromUserId === user.id
      );

      const _mfd = (_fr: any[]) => {
        return _fr.map((_f: any) => {
          const _fid = _f.user1_id === user.id ? _f.user2_id : _f.user1_id;
          const _fdata = _ul.find((_u: any) => _u.id === _fid);
          
          return {
            id: _fid,
            username: _fdata?.username || _fdata?.email?.split('@')[0] || 'Unknown User',
            email: _fdata?.email || '',
            status: 'offline' as const,
            created_at: _f.created_at || new Date().toISOString()
          };
        });
      };

      const _mrd = (_req: any[]) => {
        return _req.map((_req: any) => {
          const _fu = _ul.find((_u: any) => _u.id === _req.fromUserId);
          return {
            id: _req.id,
            fromUserId: _req.fromUserId,
            fromUsername: _fu?.username || _fu?.email?.split('@')[0] || 'Unknown User',
            toUserId: _req.toUserId,
            created_at: _req.created_at || new Date().toISOString()
          };
        });
      };

      _sf(_mfd(_uf));
      _sfr(_mrd(_ir));
      _spr(_mfd([]));
      _ssr(_mfd(_or));
    } catch (_e) {
      _sf([]);
      _sfr([]);
      _spr([]);
      _ssr([]);
    } finally {
      _sl(false);
    }
  };

  const _sfr_fn = async (_uid: string, _un?: string): Promise<boolean> => {
    if (!user || _uid === user.id) return false;

    try {
      const _rd = _gfrl();
      
      const _er = _rd.find((_req: any) => 
        (_req.fromUserId === user.id && _req.toUserId === _uid) ||
        (_req.fromUserId === _uid && _req.toUserId === user.id)
      );

      if (_er) return false;

      const _nr = {
        id: Date.now().toString(),
        fromUserId: user.id,
        toUserId: _uid,
        created_at: new Date().toISOString()
      };

      _rd.push(_nr);
      _sfrl(_rd);
      await _rf();
      return true;
    } catch (_e) {
      return false;
    }
  };

  const _afr = async (_rid: string): Promise<boolean> => {
    try {
      const _rd = _gfrl();
      const _req = _rd.find((_req: any) => _req.id === _rid);
      
      if (!_req || !user) return false;

      const _fd = _gfl();
      const _nf = {
        id: Date.now().toString(),
        user1_id: _req.fromUserId,
        user2_id: _req.toUserId,
        status: 'accepted',
        created_at: new Date().toISOString()
      };
      _fd.push(_nf);
      _sfl(_fd);

      const _ur = _rd.filter((_req: any) => _req.id !== _rid);
      _sfrl(_ur);

      await _rf();
      return true;
    } catch (_e) {
      return false;
    }
  };

  const _rfr = async (_rid: string): Promise<boolean> => {
    try {
      const _rd = _gfrl();
      const _ur = _rd.filter((_req: any) => _req.id !== _rid);
      _sfrl(_ur);
      await _rf();
      return true;
    } catch (_e) {
      return false;
    }
  };

  const _dfr = async (_rid: string): Promise<boolean> => {
    return _rfr(_rid);
  };

  const _rmf = async (_fid: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const _fd = _gfl();
      const _uf = _fd.filter((_f: any) => 
        !((_f.user1_id === user.id && _f.user2_id === _fid) ||
          (_f.user1_id === _fid && _f.user2_id === user.id))
      );
      _sfl(_uf);
      await _rf();
      return true;
    } catch (_e) {
      return false;
    }
  };

  const _bu = async (_uid: string): Promise<boolean> => {
    if (!user || _uid === user.id) return false;

    try {
      const _fd = _gfl();
      
      const _ffd = _fd.filter((_f: any) => 
        !((_f.user1_id === user.id && _f.user2_id === _uid) ||
          (_f.user1_id === _uid && _f.user2_id === user.id))
      );

      const _be = {
        id: Date.now().toString(),
        user1_id: user.id,
        user2_id: _uid,
        status: 'blocked',
        created_at: new Date().toISOString()
      };

      _ffd.push(_be);
      _sfl(_ffd);
      await _rf();
      return true;
    } catch (_e) {
      return false;
    }
  };

  const _uu = async (_uid: string): Promise<boolean> => {
    try {
      const _fd = _gfl();
      const _ffd = _fd.filter((_f: any) => 
        !(_f.user1_id === user?.id && _f.user2_id === _uid && _f.status === 'blocked')
      );

      _sfl(_ffd);
      await _rf();
      return true;
    } catch (_e) {
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      _rf();
    }
  }, [user]);

  const _cv = {
    friends: _f,
    friendRequests: _fr,
    pendingRequests: _pr,
    sentRequests: _sr,
    sendFriendRequest: _sfr_fn,
    acceptFriendRequest: _afr,
    rejectFriendRequest: _rfr,
    declineFriendRequest: _dfr,
    removeFriend: _rmf,
    blockUser: _bu,
    unblockUser: _uu,
    areFriends: _af,
    hasPendingRequest: _hpr,
    loading: _l,
    refreshFriends: _rf
  };

  return (
    <_ctx.Provider value={_cv}>
      {children}
    </_ctx.Provider>
  );
};

export const useFriends = () => {
  const _c = useContext(_ctx);
  if (_c === undefined) {
    throw new Error('useFriends must be used within a FriendsProvider');
  }
  return _c;
};
