import React, { useState } from 'react';
import { Users, Star, Clock, Send } from 'lucide-react';
import { Post } from '../types';

const MOCK_POSTS: Post[] = [
    { id: '1', author: 'Sophie (Maman de Léo)', content: 'Léo a adoré la dictée magique aujourd\'hui ! Il a ri aux éclats avec la phrase sur le dragon.', likes: 12 },
    { id: '2', author: 'Marc (Papa de Julie)', content: 'Astuce : Pour la poésie, on le fait en chantant, ça marche super bien avec le mode "Fun".', likes: 8 },
];

const ParentDashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [newPost, setNewPost] = useState('');

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post: Post = {
        id: Date.now().toString(),
        author: 'Moi',
        content: newPost,
        likes: 0
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-yellow-400">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-500">Activités Réussies</h3>
                <Star className="text-yellow-400 fill-current" />
            </div>
            <p className="text-3xl font-black text-gray-800">12</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-400">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-500">Temps Apprentissage</h3>
                <Clock className="text-blue-400" />
            </div>
            <p className="text-3xl font-black text-gray-800">2h 15m</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-400">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-500">Niveau de Fun</h3>
                <Users className="text-purple-400" />
            </div>
            <p className="text-3xl font-black text-gray-800">Maximum</p>
        </div>
      </div>

      {/* Community Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6" />
                Le Coin des Parents
            </h2>
        </div>
        
        <div className="p-6 space-y-6">
            <div className="flex gap-4">
                <input 
                    type="text" 
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Partagez une astuce ou une réussite..."
                    className="flex-1 p-3 border rounded-xl outline-none focus:border-indigo-500"
                />
                <button 
                    onClick={handlePost}
                    className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-4">
                {posts.map(post => (
                    <div key={post.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-indigo-900">{post.author}</span>
                            <span className="text-xs text-gray-400">Il y a 2 min</span>
                        </div>
                        <p className="text-gray-700">{post.content}</p>
                        <div className="mt-3 flex items-center gap-1 text-gray-400 text-sm">
                            <Star className="w-4 h-4 hover:text-yellow-400 cursor-pointer" />
                            {post.likes}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
