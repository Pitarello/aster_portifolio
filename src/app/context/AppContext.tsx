<<<<<<< HEAD
﻿import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
=======
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e

import { CourseData, coursesData as initialCourses } from '../data/courses';
import { Roadmap, roadmapsData as initialRoadmaps } from '../data/roadmaps';

// Types - Simulating microservices data models
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role?: 'user' | 'partner' | 'admin';
  partnerStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  companyInfo?: {
    name: string;
<<<<<<< HEAD
    corporateName?: string;
=======
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
    description: string;
  };
  area: 'tech' | 'fashion' | 'architecture';
  bio: string;
<<<<<<< HEAD
  headline?: string;           // LinkedIn: "título profissional" abaixo do nome
  location?: string;           // cidade/estado
  website?: string;            // site pessoal
  phone?: string;
=======
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  avatar: string;
  coverImage: string;
  professionalScore: number;
  followers: number;
  following: number;
  followersIds: string[];
  followingIds: string[];
  skills: string[];
<<<<<<< HEAD
  experiences: { title: string; company: string; period: string; description?: string; current?: boolean }[];
  education?: { institution: string; degree: string; field: string; period: string; description?: string }[];
  certifications?: { name: string; issuer: string; date: string; url?: string }[];
  languages?: { name: string; level: string }[];
  volunteer?: { role: string; organization: string; period: string; description?: string }[];
=======
  experiences: { title: string; company: string; period: string }[];
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  completedLessons?: string[];
  testRetries?: Record<string, number>;
  testScores?: Record<string, number>;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userArea: 'tech' | 'fashion' | 'architecture';
  content: string;
  image?: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  timestamp: number;
}

export interface ChatMessage {
  id: number;
  sender: 'admin' | 'partner';
  text: string;
  time: string;
}

<<<<<<< HEAD
export interface PortfolioComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: number;
}

export interface PortfolioProject {
  id: string;
  userId: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  link?: string;
  githubUrl?: string;
  category: string;
  tags: string[];
  reactions: Record<string, string[]>; // emoji -> userId[]
  comments: PortfolioComment[];
}

export interface DirectMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
  timestamp: number;
=======
export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
}

interface AppContextType {
  // Auth Service
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  
  // User Service
  updateProfile: (updates: Partial<User>) => void;
  getAllUsers: () => User[];
  getUserById: (userId: string) => User | undefined;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
  
  // Post Service
  posts: Post[];
  createPost: (content: string, image?: string) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  
  // Portfolio Service
  portfolio: PortfolioProject[];
<<<<<<< HEAD
  addProject: (project: Omit<PortfolioProject, 'id' | 'userId' | 'reactions' | 'comments'>) => void;
  removeProject: (projectId: string) => void;
  updateProject: (projectId: string, updates: Omit<PortfolioProject, 'id' | 'userId' | 'reactions' | 'comments'>) => void;
  getPortfolioByUserId: (userId: string) => PortfolioProject[];
  reactToProject: (projectId: string, emoji: string) => void;
  commentOnProject: (projectId: string, content: string) => void;
  removeProjectComment: (projectId: string, commentId: string) => void;
=======
  addProject: (project: Omit<PortfolioProject, 'id'>) => void;
  removeProject: (projectId: string) => void;
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e

  // Learning Service
  completeLesson: (lessonId: string, points: number) => void;
  courses: CourseData[];
  roadmaps: Roadmap[];
  addCourse: (course: CourseData) => void;
  updateCourse: (course: CourseData) => void;
  addRoadmap: (roadmap: Roadmap) => void;
  updateRoadmap: (roadmap: Roadmap) => void;
<<<<<<< HEAD
  submitCourseForReview: (courseId: string) => void;
  submitRoadmapForReview: (roadmapId: string) => void;
  approveContent: (type: 'course' | 'roadmap', id: string) => void;
  rejectContent: (type: 'course' | 'roadmap', id: string, reason: string) => void;
  
  // Partner System
  applyForPartner: (companyName: string, corporateName: string, description: string) => void;
  approvePartner: (userId: string) => void;
  rejectPartner: (userId: string) => void;
  
  // Chat System (admin ↔ partner)
  chatMessages: Record<string, ChatMessage[]>;
  sendMessageToPartner: (partnerId: string, text: string) => void;
  sendMessageToAdmin: (text: string) => void;

  // Direct Messages (user ↔ user)
  directMessages: Record<string, DirectMessage[]>; // key: conversationId (sorted userIds joined by '_')
  sendDirectMessage: (toUserId: string, text: string) => void;
  getConversationId: (userIdA: string, userIdB: string) => string;
=======
  
  // Partner System
  applyForPartner: (companyName: string, description: string) => void;
  approvePartner: (userId: string) => void;
  rejectPartner: (userId: string) => void;
  
  // Chat System
  chatMessages: Record<string, ChatMessage[]>;
  sendMessageToPartner: (partnerId: string, text: string) => void;
  sendMessageToAdmin: (text: string) => void;
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  area: 'tech' | 'fashion' | 'architecture';
}

<<<<<<< HEAD
// Prevent HMR from recreating the context object and breaking useContext
const globalContext = globalThis as typeof globalThis & { __AppContext?: React.Context<AppContextType | undefined> };
const AppContext = globalContext.__AppContext ?? createContext<AppContextType | undefined>(undefined);
if (process.env.NODE_ENV !== 'production') {
  globalContext.__AppContext = AppContext;
}

// Mock data - simulating database
const mockChatMessages: Record<string, ChatMessage[]> = {};
=======
const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data - simulating database
const mockChatMessages: Record<string, ChatMessage[]> = {
  '1': [
    { id: 1, sender: 'partner', text: 'Olá Brenda! Acabei de enviar minha nova trilha de React. Pode dar uma olhada?', time: '10:30' },
    { id: 2, sender: 'admin', text: 'Oi Ana! Vou verificar agora mesmo. Recebi a notificação.', time: '10:32' }
  ],
  '2': [
    { id: 1, sender: 'partner', text: 'Tive um problema ao fazer o upload do vídeo 3.', time: 'Ontem' },
    { id: 2, sender: 'admin', text: 'Qual formato você está tentando enviar?', time: 'Ontem' }
  ]
};
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e

const mockUsers: User[] = [
  {
    id: 'admin_1',
    name: 'Brenda',
    email: 'brendacgl@outlook.com.br',
    password: 'Peixeloco123@',
    role: 'admin',
    area: 'tech',
<<<<<<< HEAD
    bio: 'Super Administradora da Plataforma ASTER',
=======
    bio: 'Super Administradora da Plataforma ProNetwork',
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200',
    professionalScore: 9999,
    followers: 0,
    following: 0,
    followersIds: [],
    followingIds: [],
    skills: ['Management', 'Platform Admin'],
    completedLessons: [],
    experiences: []
<<<<<<< HEAD
  }
];

const mockPosts: Post[] = [];
=======
  },
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana@pronetwork.com',
    password: 'Peixeloco123@',
    role: 'partner',
    partnerStatus: 'approved',
    companyInfo: {
      name: 'TechEdu',
      description: 'Cursos de tecnologia e programação avançada.'
    },
    area: 'tech',
    bio: 'Full Stack Developer | React & Node.js Specialist',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200',
    professionalScore: 850,
    followers: 1234,
    following: 456,
    followersIds: [],
    followingIds: [],
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    completedLessons: [],
    experiences: [
      { title: 'Senior Developer', company: 'Tech Corp', period: '2021 - Present' },
      { title: 'Developer', company: 'StartupXYZ', period: '2019 - 2021' }
    ]
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    email: 'carlos@pronetwork.com',
    area: 'fashion',
    bio: 'Fashion Designer | Sustainable Fashion Advocate',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    coverImage: 'https://images.unsplash.com/photo-1558769132-cb1aea3c8565?w=1200',
    professionalScore: 720,
    followers: 890,
    following: 234,
    followersIds: [],
    followingIds: [],
    skills: ['Fashion Design', 'Textile', 'Branding', 'Sustainability'],
    completedLessons: [],
    experiences: [
      { title: 'Lead Designer', company: 'Fashion House', period: '2020 - Present' }
    ]
  },
  {
    id: '3',
    name: 'Marina Costa',
    email: 'marina@pronetwork.com',
    area: 'architecture',
    bio: 'Architect | Sustainable Urban Planning',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    coverImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200',
    professionalScore: 920,
    followers: 2100,
    following: 567,
    followersIds: [],
    followingIds: [],
    skills: ['AutoCAD', 'Revit', 'SketchUp', 'Urban Planning'],
    completedLessons: [],
    experiences: [
      { title: 'Senior Architect', company: 'Design Studio', period: '2018 - Present' }
    ]
  }
];

const mockPosts: Post[] = [
  {
    id: 'p1',
    userId: '1',
    userName: 'Ana Silva',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    userArea: 'tech',
    content: 'Excited to share my latest project using React and TypeScript! Building scalable microservices architecture. 🚀',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    likes: 42,
    likedBy: [],
    comments: [],
    timestamp: Date.now() - 3600000
  },
  {
    id: 'p2',
    userId: '2',
    userName: 'Carlos Mendes',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    userArea: 'fashion',
    content: 'New sustainable fashion collection dropping next week! Made with 100% recycled materials. 🌱',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    likes: 156,
    likedBy: [],
    comments: [],
    timestamp: Date.now() - 7200000
  },
  {
    id: 'p3',
    userId: '3',
    userName: 'Marina Costa',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    userArea: 'architecture',
    content: 'Completed the design for a sustainable community center. Green architecture is the future! 🏗️',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    likes: 89,
    likedBy: [],
    comments: [],
    timestamp: Date.now() - 10800000
  }
];
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [courses, setCourses] = useState<CourseData[]>(initialCourses);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(initialRoadmaps);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(mockChatMessages);
<<<<<<< HEAD
  const [directMessages, setDirectMessages] = useState<Record<string, DirectMessage[]>>({});
=======
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
<<<<<<< HEAD
    // Load users list first, merging with mockUsers to preserve admin
    const savedUsers = localStorage.getItem('aster_users');
    let loadedUsers = mockUsers;
    if (savedUsers) {
      const parsed: User[] = JSON.parse(savedUsers);
      // Merge: saved users override mockUsers, EXCEPT admin credentials always come from mockUsers
      const mergedMap = new Map<string, User>();
      mockUsers.forEach(u => mergedMap.set(u.id, u));
      parsed.forEach(u => {
        const mock = mockUsers.find(m => m.id === u.id);
        if (mock) {
          // For mock users (like admin), always preserve email and password from mockUsers
          mergedMap.set(u.id, { ...u, email: mock.email, password: mock.password, role: mock.role });
        } else {
          mergedMap.set(u.id, u);
        }
      });
      loadedUsers = Array.from(mergedMap.values());
      setUsers(loadedUsers);
    }

    const savedUser = localStorage.getItem('aster_user');
    if (savedUser) {
      const parsed: User = JSON.parse(savedUser);
      // Sync currentUser with the latest version from users list
      const fresh = loadedUsers.find(u => u.id === parsed.id);
      setCurrentUser(fresh ?? parsed);
    }

    const savedPosts = localStorage.getItem('aster_posts');
=======
    const savedUser = localStorage.getItem('pronetwork_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const savedPosts = localStorage.getItem('pronetwork_posts');
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }

<<<<<<< HEAD
    const savedPortfolio = localStorage.getItem('aster_portfolio');
=======
    const savedPortfolio = localStorage.getItem('pronetwork_portfolio');
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }

<<<<<<< HEAD
    const savedRoadmaps = localStorage.getItem('aster_roadmaps');
    if (savedRoadmaps) {
      const parsed = JSON.parse(savedRoadmaps);
      if (parsed.length > 0) setRoadmaps(parsed);
    }
    
    const savedCourses = localStorage.getItem('aster_courses');
    if (savedCourses) {
      const parsed = JSON.parse(savedCourses);
      if (parsed.length > 0) setCourses(parsed);
    }
    
    const savedChats = localStorage.getItem('aster_chats');
    if (savedChats) {
      setChatMessages(JSON.parse(savedChats));
    }

    const savedDMs = localStorage.getItem('aster_direct_messages');
    if (savedDMs) {
      setDirectMessages(JSON.parse(savedDMs));
=======
    const savedCourses = localStorage.getItem('pronetwork_courses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }

    const savedRoadmaps = localStorage.getItem('pronetwork_roadmaps');
    if (savedRoadmaps) {
      setRoadmaps(JSON.parse(savedRoadmaps));
    }
    
    const savedChats = localStorage.getItem('pronetwork_chats');
    if (savedChats) {
      setChatMessages(JSON.parse(savedChats));
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
    }
    
    setIsInitialized(true);
  }, []);

<<<<<<< HEAD
  // Persist users list whenever it changes (after initialization)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('aster_users', JSON.stringify(users));
    }
  }, [users, isInitialized]);

=======
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  // Auth Service methods
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    
    const user = users.find(u => u.email.trim().toLowerCase() === cleanEmail);
    // If user has a specific password set, check it. Otherwise, accept any password for mock users.
    if (user && (!user.password || user.password === cleanPassword)) {
      setCurrentUser(user);
<<<<<<< HEAD
      localStorage.setItem('aster_user', JSON.stringify(user));
=======
      localStorage.setItem('pronetwork_user', JSON.stringify(user));
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
      return true;
    }
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    // Simulate API call
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
<<<<<<< HEAD
      password: data.password,
      area: data.area,
      bio: '',
      avatar: '',
      coverImage: '',
=======
      area: data.area,
      bio: '',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200`,
      coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200',
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
      professionalScore: 100,
      followers: 0,
      following: 0,
      followersIds: [],
      followingIds: [],
      skills: [],
      experiences: [],
      completedLessons: []
    };
    
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
<<<<<<< HEAD
    localStorage.setItem('aster_user', JSON.stringify(newUser));
=======
    localStorage.setItem('pronetwork_user', JSON.stringify(newUser));
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
<<<<<<< HEAD
    localStorage.removeItem('aster_user');
=======
    localStorage.removeItem('pronetwork_user');
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  };

  // User Service methods
  const updateProfile = (updates: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
<<<<<<< HEAD
      localStorage.setItem('aster_user', JSON.stringify(updatedUser));
=======
      localStorage.setItem('pronetwork_user', JSON.stringify(updatedUser));
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
      
      // Update in users list
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    }
  };

  const getAllUsers = () => users;

  const getUserById = (userId: string) => users.find(u => u.id === userId);

  const followUser = (userId: string) => {
    if (!currentUser) return;

<<<<<<< HEAD
    const followingIds = [...(currentUser.followingIds || [])];
    if (followingIds.includes(userId)) return;
    followingIds.push(userId);

    const updatedUser = { ...currentUser, followingIds, following: followingIds.length };
    setCurrentUser(updatedUser);
    localStorage.setItem('aster_user', JSON.stringify(updatedUser));

    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        const followersIds = [...(u.followersIds || []), currentUser.id];
        return { ...u, followersIds, followers: followersIds.length };
      }
      if (u.id === currentUser.id) return updatedUser;
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('aster_users', JSON.stringify(updatedUsers));
=======
    const updatedUser = { ...currentUser };
    // Ensure followingIds exists
    if (!updatedUser.followingIds) {
      updatedUser.followingIds = [];
    }
    
    if (!updatedUser.followingIds.includes(userId)) {
      updatedUser.followingIds.push(userId);
      const userToFollow = users.find(u => u.id === userId);
      if (userToFollow) {
        // Ensure followersIds exists
        if (!userToFollow.followersIds) {
          userToFollow.followersIds = [];
        }
        userToFollow.followersIds.push(updatedUser.id);
        setUsers(users.map(u => u.id === userId ? userToFollow : u));
      }
    }

    setCurrentUser(updatedUser);
    localStorage.setItem('pronetwork_user', JSON.stringify(updatedUser));
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  };

  const unfollowUser = (userId: string) => {
    if (!currentUser) return;

<<<<<<< HEAD
    const followingIds = (currentUser.followingIds || []).filter(id => id !== userId);
    const updatedUser = { ...currentUser, followingIds, following: followingIds.length };
    setCurrentUser(updatedUser);
    localStorage.setItem('aster_user', JSON.stringify(updatedUser));

    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        const followersIds = (u.followersIds || []).filter(id => id !== currentUser.id);
        return { ...u, followersIds, followers: followersIds.length };
      }
      if (u.id === currentUser.id) return updatedUser;
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('aster_users', JSON.stringify(updatedUsers));
=======
    const updatedUser = { ...currentUser };
    // Ensure followingIds exists
    if (!updatedUser.followingIds) {
      updatedUser.followingIds = [];
    }
    
    if (updatedUser.followingIds.includes(userId)) {
      updatedUser.followingIds = updatedUser.followingIds.filter(id => id !== userId);
      const userToUnfollow = users.find(u => u.id === userId);
      if (userToUnfollow) {
        // Ensure followersIds exists
        if (!userToUnfollow.followersIds) {
          userToUnfollow.followersIds = [];
        }
        userToUnfollow.followersIds = userToUnfollow.followersIds.filter(id => id !== updatedUser.id);
        setUsers(users.map(u => u.id === userId ? userToUnfollow : u));
      }
    }

    setCurrentUser(updatedUser);
    localStorage.setItem('pronetwork_user', JSON.stringify(updatedUser));
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  };

  const isFollowing = (userId: string) => {
    if (!currentUser) return false;
<<<<<<< HEAD
    return (currentUser.followingIds || []).includes(userId);
=======
    if (!currentUser.followingIds) return false;
    return currentUser.followingIds.includes(userId);
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  };

  // Post Service methods
  const createPost = (content: string, image?: string) => {
    if (!currentUser) return;
<<<<<<< HEAD
=======

>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userArea: currentUser.area,
      content,
      image,
      likes: 0,
      likedBy: [],
      comments: [],
      timestamp: Date.now()
    };
<<<<<<< HEAD
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('aster_posts', JSON.stringify(updatedPosts));
=======

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('pronetwork_posts', JSON.stringify(updatedPosts));
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  };

  const likePost = (postId: string) => {
    if (!currentUser) return;
<<<<<<< HEAD
=======

>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likedBy.includes(currentUser.id);
        return {
          ...post,
          likes: hasLiked ? post.likes - 1 : post.likes + 1,
<<<<<<< HEAD
          likedBy: hasLiked
=======
          likedBy: hasLiked 
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
            ? post.likedBy.filter(id => id !== currentUser.id)
            : [...post.likedBy, currentUser.id]
        };
      }
      return post;
    });
<<<<<<< HEAD
    setPosts(updatedPosts);
    localStorage.setItem('aster_posts', JSON.stringify(updatedPosts));
=======

    setPosts(updatedPosts);
    localStorage.setItem('pronetwork_posts', JSON.stringify(updatedPosts));
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser) return;
<<<<<<< HEAD
=======

>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      postId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      timestamp: Date.now()
    };
<<<<<<< HEAD
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('aster_posts', JSON.stringify(updatedPosts));
  };

  // Portfolio Service methods
  const addProject = (project: Omit<PortfolioProject, 'id' | 'userId' | 'reactions' | 'comments'>) => {
    if (!currentUser) return;
    const newProject: PortfolioProject = { ...project, id: `project_${Date.now()}`, userId: currentUser.id, reactions: {}, comments: [] };
    const updatedPortfolio = [...portfolio, newProject];
    setPortfolio(updatedPortfolio);
    localStorage.setItem('aster_portfolio', JSON.stringify(updatedPortfolio));
=======

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('pronetwork_posts', JSON.stringify(updatedPosts));
  };

  // Portfolio Service methods
  const addProject = (project: Omit<PortfolioProject, 'id'>) => {
    const newProject: PortfolioProject = {
      ...project,
      id: `project_${Date.now()}`
    };

    const updatedPortfolio = [...portfolio, newProject];
    setPortfolio(updatedPortfolio);
    localStorage.setItem('pronetwork_portfolio', JSON.stringify(updatedPortfolio));
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  };

  const removeProject = (projectId: string) => {
    const updatedPortfolio = portfolio.filter(p => p.id !== projectId);
    setPortfolio(updatedPortfolio);
<<<<<<< HEAD
    localStorage.setItem('aster_portfolio', JSON.stringify(updatedPortfolio));
  };

  const updateProject = (projectId: string, updates: Omit<PortfolioProject, 'id' | 'userId' | 'reactions' | 'comments'>) => {
    const updatedPortfolio = portfolio.map(p =>
      p.id === projectId ? { ...p, ...updates } : p
    );
    setPortfolio(updatedPortfolio);
    localStorage.setItem('aster_portfolio', JSON.stringify(updatedPortfolio));
  };

  const getPortfolioByUserId = (userId: string) => portfolio.filter(p => p.userId === userId);

  const reactToProject = (projectId: string, emoji: string) => {
    if (!currentUser) return;
    const updatedPortfolio = portfolio.map(p => {
      if (p.id !== projectId) return p;
      const reactions = { ...(p.reactions || {}) };
      const users = reactions[emoji] || [];
      if (users.includes(currentUser.id)) {
        reactions[emoji] = users.filter(id => id !== currentUser.id);
        if (reactions[emoji].length === 0) delete reactions[emoji];
      } else {
        reactions[emoji] = [...users, currentUser.id];
      }
      return { ...p, reactions };
    });
    setPortfolio(updatedPortfolio);
    localStorage.setItem('aster_portfolio', JSON.stringify(updatedPortfolio));
  };

  const commentOnProject = (projectId: string, content: string) => {
    if (!currentUser || !content.trim()) return;
    const comment: PortfolioComment = {
      id: `pc_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: content.trim(),
      timestamp: Date.now(),
    };
    const updatedPortfolio = portfolio.map(p =>
      p.id === projectId ? { ...p, comments: [...(p.comments || []), comment] } : p
    );
    setPortfolio(updatedPortfolio);
    localStorage.setItem('aster_portfolio', JSON.stringify(updatedPortfolio));
  };

  const removeProjectComment = (projectId: string, commentId: string) => {
    const updatedPortfolio = portfolio.map(p =>
      p.id === projectId ? { ...p, comments: (p.comments || []).filter(c => c.id !== commentId) } : p
    );
    setPortfolio(updatedPortfolio);
    localStorage.setItem('aster_portfolio', JSON.stringify(updatedPortfolio));
=======
    localStorage.setItem('pronetwork_portfolio', JSON.stringify(updatedPortfolio));
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  };

  // Learning Service methods
  const completeLesson = (lessonId: string, points: number) => {
    if (!currentUser) return;
    const completed = currentUser.completedLessons || [];
<<<<<<< HEAD
    if (completed.includes(lessonId)) return;
=======
    if (completed.includes(lessonId)) return; // already completed

>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
    const updatedUser = {
      ...currentUser,
      completedLessons: [...completed, lessonId],
      professionalScore: (currentUser.professionalScore || 0) + points
    };
    setCurrentUser(updatedUser);
<<<<<<< HEAD
    localStorage.setItem('aster_user', JSON.stringify(updatedUser));
=======
    localStorage.setItem('pronetwork_user', JSON.stringify(updatedUser));
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const addCourse = (course: CourseData) => {
    const updatedCourses = [...courses, course];
    setCourses(updatedCourses);
<<<<<<< HEAD
    localStorage.setItem('aster_courses', JSON.stringify(updatedCourses));
=======
    localStorage.setItem('pronetwork_courses', JSON.stringify(updatedCourses));
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  };

  const updateCourse = (course: CourseData) => {
    const updatedCourses = courses.map(c => c.id === course.id ? course : c);
    setCourses(updatedCourses);
<<<<<<< HEAD
    localStorage.setItem('aster_courses', JSON.stringify(updatedCourses));
=======
    localStorage.setItem('pronetwork_courses', JSON.stringify(updatedCourses));
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  };

  const addRoadmap = (roadmap: Roadmap) => {
    const updatedRoadmaps = [...roadmaps, roadmap];
    setRoadmaps(updatedRoadmaps);
<<<<<<< HEAD
    localStorage.setItem('aster_roadmaps', JSON.stringify(updatedRoadmaps));
=======
    localStorage.setItem('pronetwork_roadmaps', JSON.stringify(updatedRoadmaps));
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  };

  const updateRoadmap = (roadmap: Roadmap) => {
    const updatedRoadmaps = roadmaps.map(r => r.id === roadmap.id ? roadmap : r);
    setRoadmaps(updatedRoadmaps);
<<<<<<< HEAD
    localStorage.setItem('aster_roadmaps', JSON.stringify(updatedRoadmaps));
  };

  const submitCourseForReview = (courseId: string) => {
    if (!currentUser) return;
    const updated = courses.map(c =>
      c.id === courseId
        ? { ...c, status: 'pending' as const, submittedBy: currentUser.id, submittedAt: Date.now() }
        : c
    );
    setCourses(updated);
    localStorage.setItem('aster_courses', JSON.stringify(updated));
  };

  const submitRoadmapForReview = (roadmapId: string) => {
    if (!currentUser) return;
    const updated = roadmaps.map(r =>
      r.id === roadmapId
        ? { ...r, status: 'pending' as const, submittedBy: currentUser.id, submittedAt: Date.now() }
        : r
    );
    setRoadmaps(updated);
    localStorage.setItem('aster_roadmaps', JSON.stringify(updated));
  };

  const approveContent = (type: 'course' | 'roadmap', id: string) => {
    if (type === 'course') {
      const updated = courses.map(c => c.id === id ? { ...c, status: 'approved' as const } : c);
      setCourses(updated);
      localStorage.setItem('aster_courses', JSON.stringify(updated));
      const course = courses.find(c => c.id === id);
      if (course?.submittedBy) {
        const dateStr = new Date().toLocaleDateString('pt-BR');
        sendMessageToPartner(course.submittedBy, `✅ O seu curso "${course.title}" foi APROVADO e está agora disponível na plataforma!\n\nData: ${dateStr}`);
      }
    } else {
      const updated = roadmaps.map(r => r.id === id ? { ...r, status: 'approved' as const } : r);
      setRoadmaps(updated);
      localStorage.setItem('aster_roadmaps', JSON.stringify(updated));
      const roadmap = roadmaps.find(r => r.id === id);
      if (roadmap?.submittedBy) {
        const dateStr = new Date().toLocaleDateString('pt-BR');
        sendMessageToPartner(roadmap.submittedBy, `✅ A sua trilha "${roadmap.title}" foi APROVADA e está agora disponível na plataforma!\n\nData: ${dateStr}`);
      }
    }
  };

  const rejectContent = (type: 'course' | 'roadmap', id: string, reason: string) => {
    if (type === 'course') {
      const updated = courses.map(c => c.id === id ? { ...c, status: 'rejected' as const, rejectionReason: reason } : c);
      setCourses(updated);
      localStorage.setItem('aster_courses', JSON.stringify(updated));
      const course = courses.find(c => c.id === id);
      if (course?.submittedBy) {
        const dateStr = new Date().toLocaleDateString('pt-BR');
        sendMessageToPartner(course.submittedBy, `STATUS: Recusado\nCONTEÚDO: ${course.title}\nDATA: ${dateStr}\nMOTIVO: ${reason}`);
      }
    } else {
      const updated = roadmaps.map(r => r.id === id ? { ...r, status: 'rejected' as const, rejectionReason: reason } : r);
      setRoadmaps(updated);
      localStorage.setItem('aster_roadmaps', JSON.stringify(updated));
      const roadmap = roadmaps.find(r => r.id === id);
      if (roadmap?.submittedBy) {
        const dateStr = new Date().toLocaleDateString('pt-BR');
        sendMessageToPartner(roadmap.submittedBy, `STATUS: Recusado\nCONTEÚDO: ${roadmap.title}\nDATA: ${dateStr}\nMOTIVO: ${reason}`);
      }
    }
  };

  // Direct Message functions
  const getConversationId = (a: string, b: string) => [a, b].sort().join('_');

  const sendDirectMessage = (toUserId: string, text: string) => {
    if (!currentUser) return;
    const convId = getConversationId(currentUser.id, toUserId);
    const msg: DirectMessage = {
      id: `dm_${Date.now()}`,
      senderId: currentUser.id,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
    };
    const updated = {
      ...directMessages,
      [convId]: [...(directMessages[convId] || []), msg],
    };
    setDirectMessages(updated);
    localStorage.setItem('aster_direct_messages', JSON.stringify(updated));
  };

  // Partner System Methods
  const applyForPartner = (companyName: string, corporateName: string, description: string) => {
=======
    localStorage.setItem('pronetwork_roadmaps', JSON.stringify(updatedRoadmaps));
  };

  // Partner System Methods
  const applyForPartner = (companyName: string, description: string) => {
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      partnerStatus: 'pending' as const,
      companyInfo: {
        name: companyName,
<<<<<<< HEAD
        corporateName: corporateName,
=======
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
        description: description
      }
    };
    setCurrentUser(updatedUser);
<<<<<<< HEAD
    localStorage.setItem('aster_user', JSON.stringify(updatedUser));
=======
    localStorage.setItem('pronetwork_user', JSON.stringify(updatedUser));
    
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
  };

  const approvePartner = (userId: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, role: 'partner' as const, partnerStatus: 'approved' as const };
      }
      return u;
    });
    setUsers(updatedUsers);
<<<<<<< HEAD
=======
    
    // Update currentUser if it's the one being approved
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
    if (currentUser?.id === userId) {
      const updatedCurrent = updatedUsers.find(u => u.id === userId);
      if (updatedCurrent) {
        setCurrentUser(updatedCurrent);
<<<<<<< HEAD
        localStorage.setItem('aster_user', JSON.stringify(updatedCurrent));
=======
        localStorage.setItem('pronetwork_user', JSON.stringify(updatedCurrent));
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
      }
    }
  };

  const rejectPartner = (userId: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, partnerStatus: 'rejected' as const };
      }
      return u;
    });
    setUsers(updatedUsers);
<<<<<<< HEAD
=======
    
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
    if (currentUser?.id === userId) {
      const updatedCurrent = updatedUsers.find(u => u.id === userId);
      if (updatedCurrent) {
        setCurrentUser(updatedCurrent);
<<<<<<< HEAD
        localStorage.setItem('aster_user', JSON.stringify(updatedCurrent));
=======
        localStorage.setItem('pronetwork_user', JSON.stringify(updatedCurrent));
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
      }
    }
  };

  const sendMessageToPartner = (partnerId: string, text: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = { id: Date.now(), sender: 'admin', text, time: timeStr };
<<<<<<< HEAD
=======
    
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
    const updatedChats = {
      ...chatMessages,
      [partnerId]: [...(chatMessages[partnerId] || []), newMsg]
    };
<<<<<<< HEAD
    setChatMessages(updatedChats);
    localStorage.setItem('aster_chats', JSON.stringify(updatedChats));
=======
    
    setChatMessages(updatedChats);
    localStorage.setItem('pronetwork_chats', JSON.stringify(updatedChats));
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  };

  const sendMessageToAdmin = (text: string) => {
    if (!currentUser) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = { id: Date.now(), sender: 'partner', text, time: timeStr };
<<<<<<< HEAD
=======
    
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
    const updatedChats = {
      ...chatMessages,
      [currentUser.id]: [...(chatMessages[currentUser.id] || []), newMsg]
    };
<<<<<<< HEAD
    setChatMessages(updatedChats);
    localStorage.setItem('aster_chats', JSON.stringify(updatedChats));
=======
    
    setChatMessages(updatedChats);
    localStorage.setItem('pronetwork_chats', JSON.stringify(updatedChats));
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        updateProfile,
        getAllUsers,
        getUserById,
        followUser,
        unfollowUser,
        isFollowing,
        posts,
        createPost,
        likePost,
        addComment,
        portfolio,
        addProject,
        removeProject,
<<<<<<< HEAD
        updateProject,
        getPortfolioByUserId,
        reactToProject,
        commentOnProject,
        removeProjectComment,
=======
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
        completeLesson,
        courses,
        roadmaps,
        addCourse,
        updateCourse,
        addRoadmap,
        updateRoadmap,
<<<<<<< HEAD
        submitCourseForReview,
        submitRoadmapForReview,
        approveContent,
        rejectContent,
=======
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
        applyForPartner,
        approvePartner,
        rejectPartner,
        chatMessages,
        sendMessageToPartner,
<<<<<<< HEAD
        sendMessageToAdmin,
        directMessages,
        sendDirectMessage,
        getConversationId,
=======
        sendMessageToAdmin
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

<<<<<<< HEAD
export function useApp() {
  // Returns the AppContext value for use in components
=======
// Force an update to clear any stale HMR Context references
export function useApp() {
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
<<<<<<< HEAD
}
=======
}
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
