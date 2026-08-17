import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Trash2, Edit2, Plus, Users, Lock, Phone, Building2 } from 'lucide-react';
import CryptoJS from 'crypto-js';

// Sample data - can be replaced with Supabase later
const ENCRYPTION_KEY = 'well-oasis-hotel-2024-secure';

interface User {
  id: string;
  username: string;
  password: string;
  fullName: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  permissions: Record<string, string[]>;
}

interface System {
  id: string;
  name: string;
  manager: string;
  phone: string;
  email: string;
  department: string;
}

const DEPARTMENTS = [
  'الموارد البشرية',
  'الجودة',
  'الإشراف الداخلي',
  'الحسابات',
  'الاستقبال',
  'المخازن',
  'النظم والمعلومات',
  'الكاشير',
  'المطبخ'
];

const SYSTEMS = [
  'الإسكان',
  'برنامج كروت الغرف',
  'المطعم',
  'أجهزة حاسب آلي',
  'منظومة المخازن',
  'الكاميرات',
  'البصمة'
];

const PERMISSIONS = {
  'الإسكان': ['عرض', 'إضافة', 'تعديل', 'حذف'],
  'برنامج كروت الغرف': ['عرض', 'إضافة', 'تعديل', 'حذف'],
  'المطعم': ['عرض', 'إضافة', 'تعديل', 'حذف'],
  'أجهزة حاسب آلي': ['عرض', 'إضافة', 'تعديل', 'حذف'],
  'منظومة المخازن': ['عرض', 'إضافة', 'تعديل', 'حذف'],
  'الكاميرات': ['عرض', 'تحميل', 'تنزيل'],
  'البصمة': ['عرض', 'تسجيل', 'تعديل']
};

const encrypt = (text: string) => CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
const decrypt = (encrypted: string) => {
  try {
    return CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
  } catch {
    return encrypted;
  }
};

export default function Index() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      password: encrypt('password123'),
      fullName: 'أحمد محمود',
      department: 'الموارد البشرية',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      permissions: {
        'الإسكان': ['عرض', 'إضافة', 'تعديل', 'حذف'],
        'برنامج كروت الغرف': ['عرض', 'إضافة'],
        'المطعم': ['عرض'],
        'البصمة': ['عرض', 'تسجيل']
      }
    },
    {
      id: '2',
      username: 'reception',
      password: encrypt('reception123'),
      fullName: 'فاطمة علي',
      department: 'الاستقبال',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20',
      permissions: {
        'الإسكان': ['عرض', 'إضافة', 'تعديل'],
        'برنامج كروت الغرف': ['عرض', 'إضافة'],
        'البصمة': ['عرض']
      }
    }
  ]);

  const [systems, setSystems] = useState<System[]>([
    {
      id: '1',
      name: 'الإسكان',
      manager: 'محمد خالد',
      phone: '01001234567',
      email: 'housing@welloasis.com',
      department: 'الموارد البشرية'
    },
    {
      id: '2',
      name: 'المطعم',
      manager: 'سارة أحمد',
      phone: '01101234567',
      email: 'restaurant@welloasis.com',
      department: 'المطبخ'
    }
  ]);

  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ username: '', password: '', fullName: '', department: '' });

  const handleAddUser = () => {
    if (newUser.username && newUser.password && newUser.fullName && newUser.department) {
      const user: User = {
        id: Date.now().toString(),
        username: newUser.username,
        password: encrypt(newUser.password),
        fullName: newUser.fullName,
        department: newUser.department,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        permissions: {}
      };
      setUsers([...users, user]);
      setNewUser({ username: '', password: '', fullName: '', department: '' });
    }
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 rtl">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">فندق ويل الواحة 1</h1>
          <p className="text-slate-600">نظام إدارة المستخدمين والصلاحيات الشامل</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white shadow-md">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={18} />
              المستخدمون
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Lock size={18} />
              الصلاحيات
            </TabsTrigger>
            <TabsTrigger value="systems" className="flex items-center gap-2">
              <Building2 size={18} />
              المنظومات
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader className="border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">إدارة المستخدمين</CardTitle>
                    <CardDescription>إضافة وتعديل وحذف المستخدمين</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus size={18} className="ml-2" />
                        إضافة مستخدم
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rtl">
                      <DialogHeader>
                        <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="اسم المستخدم"
                          value={newUser.username}
                          onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                          className="text-right"
                        />
                        <Input
                          placeholder="كلمة المرور"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          className="text-right"
                        />
                        <Input
                          placeholder="الاسم الكامل"
                          value={newUser.fullName}
                          onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                          className="text-right"
                        />
                        <Select value={newUser.department} onValueChange={(value) => setNewUser({...newUser, department: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر القسم" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTMENTS.map(dept => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={handleAddUser} className="w-full bg-green-600 hover:bg-green-700">
                          إضافة
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {users.map(user => (
                    <div key={user.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-slate-800">{user.fullName}</h3>
                          <p className="text-sm text-slate-600">اسم المستخدم: {user.username}</p>
                          <p className="text-sm text-slate-600">القسم: {user.department}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-blue-600 hover:bg-blue-50">
                            <Edit2 size={16} />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">كلمة المرور:</span>
                          <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
                            {showPassword[user.id] ? decrypt(user.password) : '••••••••'}
                          </code>
                        </div>
                        <button onClick={() => togglePasswordVisibility(user.id)} className="text-slate-600 hover:text-slate-800">
                          {showPassword[user.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                        <p>تاريخ الإنشاء: {user.createdAt}</p>
                        <p>آخر تحديث: {user.updatedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader className="border-b border-slate-200">
                <CardTitle className="text-2xl">صلاحيات المستخدمين</CardTitle>
                <CardDescription>عرض وإدارة صلاحيات المستخدمين في المنظومات</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {users.map(user => (
                    <div key={user.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                      <h3 className="font-bold text-lg text-slate-800 mb-4">{user.fullName} ({user.username})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {SYSTEMS.map(system => (
                          <div key={system} className="bg-white p-3 rounded border border-slate-200">
                            <p className="font-semibold text-slate-700 mb-2">{system}</p>
                            <div className="flex flex-wrap gap-1">
                              {(user.permissions[system] || []).map(perm => (
                                <span key={perm} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                  {perm}
                                </span>
                              ))}
                              {(!user.permissions[system] || user.permissions[system].length === 0) && (
                                <span className="text-slate-400 text-xs">بدون صلاحيات</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Systems Tab */}
          <TabsContent value="systems" className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader className="border-b border-slate-200">
                <CardTitle className="text-2xl">المنظومات والتواصل</CardTitle>
                <CardDescription>معلومات المنظومات والمسؤولين عنها</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {systems.map(system => (
                    <div key={system.id} className="bg-gradient-to-br from-blue-50 to-slate-50 p-5 rounded-lg border border-blue-200 shadow-md hover:shadow-lg transition">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-lg text-slate-800">{system.name}</h3>
                        <Building2 className="text-blue-600" size={24} />
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-slate-700"><span className="font-semibold">المسؤول:</span> {system.manager}</p>
                        <p className="text-slate-700"><span className="font-semibold">القسم:</span> {system.department}</p>
                        <div className="flex items-center gap-2 text-slate-700">
                          <Phone size={16} className="text-green-600" />
                          <span>{system.phone}</span>
                        </div>
                        <p className="text-slate-700 break-all"><span className="font-semibold">البريد:</span> {system.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-8 text-center text-slate-600 text-sm">
        <p>© 2024 فندق ويل الواحة 1 - نظام إدارة المستخدمين والصلاحيات</p>
      </div>
    </div>
  );
}
