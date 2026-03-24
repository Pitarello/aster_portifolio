import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    description: string;
  };
  area: 'tech' | 'fashion' | 'architecture';
  bio: string;
  avatar: string;
  coverImage: string;
  professionalScore: number;
  followers: number;
  following: number;
  followersIds: string[];
  followingIds: string[];
  skills: string[];
  experiences: { title: string; company: string; period: string }[];
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

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
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
  addProject: (project: Omit<PortfolioProject, 'id'>) => void;
  removeProject: (projectId: string) => void;

  // Learning Service
  completeLesson: (lessonId: string, points: number) => void;
  courses: CourseData[];
  roadmaps: Roadmap[];
  addCourse: (course: CourseData) => void;
  updateCourse: (course: CourseData) => void;
  addRoadmap: (roadmap: Roadmap) => void;
  updateRoadmap: (roadmap: Roadmap) => void;
  
  // Partner System
  applyForPartner: (companyName: string, description: string) => void;
  approvePartner: (userId: string) => void;
  rejectPartner: (userId: string) => void;
  
  // Chat System
  chatMessages: Record<string, ChatMessage[]>;
  sendMessageToPartner: (partnerId: string, text: string) => void;
  sendMessageToAdmin: (text: string) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  area: 'tech' | 'fashion' | 'architecture';
}

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

const mockUsers: User[] = [
  {
    id: 'admin_1',
    name: 'Brenda',
    email: 'brendacgl@outlook.com.br',
    password: 'Peixeloco123@',
    role: 'admin',
    area: 'tech',
    bio: 'Super Administradora da Plataforma ProNetwork',
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);
  const [courses, setCourses] = useState<CourseData[]>(initialCourses);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(initialRoadmaps);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(mockChatMessages);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('pronetwork_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const savedPosts = localStorage.getItem('pronetwork_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }

    const savedPortfolio = localStorage.getItem('pronetwork_portfolio');
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }

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
    }
    
    setIsInitialized(true);
  }, []);

  // Auth Service methods
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    
    const user = users.find(u => u.email.trim().toLowerCase() === cleanEmail);
    // If user has a specific password set, check it. Otherwise, accept any password for mock users.
    if (user && (!user.password || user.password === cleanPassword)) {
      setCurrentUser(user);
      localStorage.setItem('pronetwork_user', JSON.stringify(user));
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
      area: data.area,
      bio: '',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200`,
      coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200',
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
    localStorage.setItem('pronetwork_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pronetwork_user');
  };

  // User Service methods
  const updateProfile = (updates: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      localStorage.setItem('pronetwork_user', JSON.stringify(updatedUser));
      
      // Update in users list
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    }
  };

  const getAllUsers = () => users;

  const getUserById = (userId: string) => users.find(u => u.id === userId);

  const followUser = (userId: string) => {
    if (!currentUser) return;

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
  };

  const unfollowUser = (userId: string) => {
    if (!currentUser) return;

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
  };

  const isFollowing = (userId: string) => {
    if (!currentUser) return false;
    if (!currentUser.followingIds) return false;
    return currentUser.followingIds.includes(userId);
  };

  // Post Service methods
  const createPost = (content: string, image?: string) => {
    if (!currentUser) return;

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

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('pronetwork_posts', JSON.stringify(updatedPosts));
  };

  const likePost = (postId: string) => {
    if (!currentUser) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likedBy.includes(currentUser.id);
        return {
          ...post,
          likes: hasLiked ? post.likes - 1 : post.likes + 1,
          likedBy: hasLiked 
            ? post.likedBy.filter(id => id !== currentUser.id)
            : [...post.likedBy, currentUser.id]
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('pronetwork_posts', JSON.stringify(updatedPosts));
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser) return;

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      postId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      timestamp: Date.now()
    };

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
  };

  const removeProject = (projectId: string) => {
    const updatedPortfolio = portfolio.filter(p => p.id !== projectId);
    setPortfolio(updatedPortfolio);
    localStorage.setItem('pronetwork_portfolio', JSON.stringify(updatedPortfolio));
  };

  // Learning Service methods
  const completeLesson = (lessonId: string, points: number) => {
    if (!currentUser) return;
    const completed = currentUser.completedLessons || [];
    if (completed.includes(lessonId)) return; // already completed

    const updatedUser = {
      ...currentUser,
      completedLessons: [...completed, lessonId],
      professionalScore: (currentUser.professionalScore || 0) + points
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('pronetwork_user', JSON.stringify(updatedUser));
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const addCourse = (course: CourseData) => {
    const updatedCourses = [...courses, course];
    setCourses(updatedCourses);
    localStorage.setItem('pronetwork_courses', JSON.stringify(updatedCourses));
  };

  const updateCourse = (course: CourseData) => {
    const updatedCourses = courses.map(c => c.id === course.id ? course : c);
    setCourses(updatedCourses);
    localStorage.setItem('pronetwork_courses', JSON.stringify(updatedCourses));
  };

  const addRoadmap = (roadmap: Roadmap) => {
    const updatedRoadmaps = [...roadmaps, roadmap];
    setRoadmaps(updatedRoadmaps);
    localStorage.setItem('pronetwork_roadmaps', JSON.stringify(updatedRoadmaps));
  };

  const updateRoadmap = (roadmap: Roadmap) => {
    const updatedRoadmaps = roadmaps.map(r => r.id === roadmap.id ? roadmap : r);
    setRoadmaps(updatedRoadmaps);
    localStorage.setItem('pronetwork_roadmaps', JSON.stringify(updatedRoadmaps));
  };

  // Partner System Methods
  const applyForPartner = (companyName: string, description: string) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      partnerStatus: 'pending' as const,
      companyInfo: {
        name: companyName,
        description: description
      }
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('pronetwork_user', JSON.stringify(updatedUser));
    
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
    
    // Update currentUser if it's the one being approved
    if (currentUser?.id === userId) {
      const updatedCurrent = updatedUsers.find(u => u.id === userId);
      if (updatedCurrent) {
        setCurrentUser(updatedCurrent);
        localStorage.setItem('pronetwork_user', JSON.stringify(updatedCurrent));
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
    
    if (currentUser?.id === userId) {
      const updatedCurrent = updatedUsers.find(u => u.id === userId);
      if (updatedCurrent) {
        setCurrentUser(updatedCurrent);
        localStorage.setItem('pronetwork_user', JSON.stringify(updatedCurrent));
      }
    }
  };

  const sendMessageToPartner = (partnerId: string, text: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = { id: Date.now(), sender: 'admin', text, time: timeStr };
    
    const updatedChats = {
      ...chatMessages,
      [partnerId]: [...(chatMessages[partnerId] || []), newMsg]
    };
    
    setChatMessages(updatedChats);
    localStorage.setItem('pronetwork_chats', JSON.stringify(updatedChats));
  };

  const sendMessageToAdmin = (text: string) => {
    if (!currentUser) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = { id: Date.now(), sender: 'partner', text, time: timeStr };
    
    const updatedChats = {
      ...chatMessages,
      [currentUser.id]: [...(chatMessages[currentUser.id] || []), newMsg]
    };
    
    setChatMessages(updatedChats);
    localStorage.setItem('pronetwork_chats', JSON.stringify(updatedChats));
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
        completeLesson,
        courses,
        roadmaps,
        addCourse,
        updateCourse,
        addRoadmap,
        updateRoadmap,
        applyForPartner,
        approvePartner,
        rejectPartner,
        chatMessages,
        sendMessageToPartner,
        sendMessageToAdmin
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Force an update to clear any stale HMR Context references
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}