import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit3, Ban, CheckCircle, X, Mail, Phone, UserCheck, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { supabaseSignup } from '../../lib/supabaseAdmin';

const TREATMENT_PHASES = [
  { value: 'newly_diagnosed', label: 'تشخيص حديث' },
  { value: 'chemotherapy', label: 'علاج كيماوي' },
  { value: 'radiation', label: 'علاج إشعاعي' },
  { value: 'recovery', label: 'تعافي' },
  { value: 'hormonal', label: 'علاج هرموني' },
];

const emptyPatient = { full_name: '', email: '', password: '', treatment_phase: 'newly_diagnosed', weight: '', height: '', phone: '', age: '' };
const emptySpec = { full_name: '', email: '', password: '', specialty: 'أخصائية تغذية', bio: '', phone: '' };

export default function AdminUsersPage() {
  const [tab, setTab] = useState('patients');
  const [patients, setPatients] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showSpecForm, setShowSpecForm] = useState(false);
  const [patientForm, setPatientForm] = useState(emptyPatient);
  const [specForm, setSpecForm] = useState(emptySpec);
  const [saving, setSaving] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [pRes, sRes] = await Promise.all([
        supabase.rpc('admin_get_users', { user_role: 'patient' }),
        supabase.rpc('admin_get_users', { user_role: 'specialist' }),
      ]);
      
      if (pRes.error) throw new Error('Patients: ' + pRes.error.message);
      if (sRes.error) throw new Error('Specialists: ' + sRes.error.message);

      setPatients(pRes.data || []);
      setSpecialists(sRes.data || []);
    } catch (err) {
      console.error('Fetch crashed:', err);
      setError('تعذر تحميل البيانات: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);


  // ── Add Patient (creates Supabase auth user then profile) ──
  const savePatient = async () => {
    setError('');
    if (!patientForm.full_name || !patientForm.email || (!editingPatient && !patientForm.password)) {
      setError('يرجى تعبئة الحقول الإلزامية'); return;
    }
    setSaving(true);
    try {
      if (editingPatient) {
        const { error } = await supabase.from('profiles').update({
          full_name: patientForm.full_name,
          treatment_phase: patientForm.treatment_phase,
          weight: parseFloat(patientForm.weight) || null,
          height: parseFloat(patientForm.height) || null,
          phone: patientForm.phone,
          age: parseInt(patientForm.age) || null,
        }).eq('id', editingPatient);
        if (error) throw error;
      } else {
        // supabaseSignup has persistSession:false — signUp won't touch the admin session
        const { data: authData, error: authErr } = await supabaseSignup.auth.signUp({
          email: patientForm.email,
          password: patientForm.password,
          options: { data: { full_name: patientForm.full_name } },
        });
        if (authErr) throw authErr;
        const newUserId = authData?.user?.id;
        if (!newUserId) throw new Error('فشل إنشاء الحساب');

        // Insert profile as admin (regular client still has admin session)
        await supabase.from('profiles').upsert({
          id: newUserId,
          full_name: patientForm.full_name,
          treatment_phase: patientForm.treatment_phase,
          weight: parseFloat(patientForm.weight) || null,
          height: parseFloat(patientForm.height) || null,
          phone: patientForm.phone,
          age: parseInt(patientForm.age) || null,
          role: 'patient',
        });
      }
      setPatientForm(emptyPatient); setShowPatientForm(false); setEditingPatient(null);
      fetchAll();
    } catch (err) {
      setError(err.message || 'حدث خطأ');
    } finally { setSaving(false); }
  };

  // ── Add Specialist ──
  const saveSpecialist = async () => {
    setError('');
    if (!specForm.full_name || !specForm.email || !specForm.password) {
      setError('يرجى تعبئة جميع الحقول'); return;
    }
    setSaving(true);
    try {
      // supabaseSignup has persistSession:false — won't touch admin session
      const { data: authData, error: authErr } = await supabaseSignup.auth.signUp({
        email: specForm.email,
        password: specForm.password,
        options: { data: { full_name: specForm.full_name } },
      });
      if (authErr) throw authErr;
      const newUserId = authData?.user?.id;
      if (!newUserId) throw new Error('فشل إنشاء الحساب');

      await supabase.from('profiles').upsert({
        id: newUserId,
        full_name: specForm.full_name,
        bio: specForm.bio,
        phone: specForm.phone,
        specialty: specForm.specialty,
        role: 'specialist',
      });

      setSpecForm(emptySpec); setShowSpecForm(false); fetchAll();
    } catch (err) { setError(err.message || 'حدث خطأ'); }
    finally { setSaving(false); }
  };

  const toggleBan = async (p) => {
    const newStatus = p.status === 'banned' ? 'active' : 'banned';
    await supabase.from('profiles').update({ status: newStatus }).eq('id', p.id);
    fetchAll();
  };

  const deleteUser = async (id) => {
    if (!window.confirm('حذف هذا المستخدم نهائياً؟')) return;
    await supabase.from('profiles').delete().eq('id', id);
    fetchAll();
  };

  const openEditPatient = (p) => {
    setPatientForm({ full_name: p.full_name || '', email: p.email || '', password: '', treatment_phase: p.treatment_phase || 'newly_diagnosed', weight: p.weight || '', height: p.height || '', phone: p.phone || '', age: p.age || '' });
    setEditingPatient(p.id); setShowPatientForm(true);
  };

  const filtered = (list) => list.filter(u => !search || u.full_name?.includes(search) || u.email?.includes(search));

  const phaseLabel = (p) => TREATMENT_PHASES.find(t => t.value === p)?.label || p || '—';

  const UserTable = ({ data, isSpecialist }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead><tr className="border-b border-slate-100">
          {['المستخدم', isSpecialist ? 'التخصص' : 'مرحلة العلاج', 'الهاتف', 'تاريخ التسجيل', 'الحالة', 'إجراءات'].map(h => (
            <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-slate-500">{h}</th>
          ))}
        </tr></thead>
        <tbody className="divide-y divide-slate-50">
          {loading ? <tr><td colSpan={6} className="text-center py-12 text-slate-400">جاري التحميل...</td></tr>
            : data.length === 0 ? <tr><td colSpan={6} className="text-center py-12 text-slate-400">لا يوجد مستخدمون</td></tr>
              : data.map(u => (
                <tr key={u.id} className={`hover:bg-slate-50 ${u.status === 'banned' ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm">{u.full_name?.charAt(0) || '؟'}</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{u.full_name || '—'}</p>
                        <p className="text-xs text-slate-400">{u.id?.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-violet-50 text-violet-700 rounded-lg text-xs font-semibold">
                      {isSpecialist ? (u.specialty || '—') : phaseLabel(u.treatment_phase)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{u.phone || '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{u.created_at ? new Date(u.created_at).toLocaleDateString('ar-DZ') : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${u.status === 'banned' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                      {u.status === 'banned' ? 'محظور' : 'نشط'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {!isSpecialist && <button onClick={() => openEditPatient(u)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit3 size={14} /></button>}
                      <button onClick={() => toggleBan(u)} className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"><Ban size={14} /></button>
                      <button onClick={() => deleteUser(u.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة المستخدمين</h1>
          <p className="text-slate-500 text-sm mt-0.5">{patients.length} مريضة · {specialists.length} أخصائي</p>
        </div>
        <button onClick={() => tab === 'patients' ? setShowPatientForm(true) : setShowSpecForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <Plus size={16} /> {tab === 'patients' ? 'إضافة مريضة' : 'إضافة أخصائي'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg font-bold">
          {error}
        </div>
      )}


      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        {[{ id: 'patients', label: `المريضات (${patients.length})`, icon: User },
          { id: 'specialists', label: `الأخصائيون (${specialists.length})`, icon: UserCheck }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم..."
          className="w-full pr-9 pl-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white" />
      </div>

      {tab === 'patients' && <UserTable data={filtered(patients)} isSpecialist={false} />}
      {tab === 'specialists' && <UserTable data={filtered(specialists)} isSpecialist={true} />}

      {/* ── Add Patient Modal ── */}
      {showPatientForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">{editingPatient ? 'تعديل بيانات المريضة' : 'إضافة مريضة جديدة'}</h2>
              <button onClick={() => { setShowPatientForm(false); setEditingPatient(null); setPatientForm(emptyPatient); setError(''); }} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
              <input placeholder="الاسم الكامل *" value={patientForm.full_name} onChange={e => setPatientForm(p => ({ ...p, full_name: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              {!editingPatient && <>
                <input type="email" placeholder="البريد الإلكتروني *" value={patientForm.email} onChange={e => setPatientForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                <input type="password" placeholder="كلمة المرور (6 أحرف على الأقل) *" value={patientForm.password} onChange={e => setPatientForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </>}
              <select value={patientForm.treatment_phase} onChange={e => setPatientForm(p => ({ ...p, treatment_phase: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white">
                {TREATMENT_PHASES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <div className="grid grid-cols-3 gap-3">
                <input type="number" placeholder="الوزن (كغ)" value={patientForm.weight} onChange={e => setPatientForm(p => ({ ...p, weight: e.target.value }))}
                  className="border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                <input type="number" placeholder="الطول (سم)" value={patientForm.height} onChange={e => setPatientForm(p => ({ ...p, height: e.target.value }))}
                  className="border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                <input type="number" placeholder="العمر" value={patientForm.age} onChange={e => setPatientForm(p => ({ ...p, age: e.target.value }))}
                  className="border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
              <input placeholder="رقم الهاتف" value={patientForm.phone} onChange={e => setPatientForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              <button onClick={savePatient} disabled={saving}
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50">
                {saving ? 'جاري الحفظ...' : editingPatient ? 'حفظ التعديلات' : 'إضافة المريضة'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Specialist Modal ── */}
      {showSpecForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">إضافة أخصائي جديد</h2>
              <button onClick={() => { setShowSpecForm(false); setError(''); }} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
              <input placeholder="الاسم الكامل *" value={specForm.full_name} onChange={e => setSpecForm(p => ({ ...p, full_name: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              <input type="email" placeholder="البريد الإلكتروني *" value={specForm.email} onChange={e => setSpecForm(p => ({ ...p, email: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              <input type="password" placeholder="كلمة المرور *" value={specForm.password} onChange={e => setSpecForm(p => ({ ...p, password: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              <select value={specForm.specialty} onChange={e => setSpecForm(p => ({ ...p, specialty: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white">
                {['أخصائية تغذية', 'طبيبة أورام', 'معالجة نفسية', 'معالجة فيزيائية', 'ممرضة متخصصة'].map(s => <option key={s}>{s}</option>)}
              </select>
              <input placeholder="رقم الهاتف" value={specForm.phone} onChange={e => setSpecForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              <textarea rows={3} placeholder="نبذة مختصرة..." value={specForm.bio} onChange={e => setSpecForm(p => ({ ...p, bio: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" />
              <button onClick={saveSpecialist} disabled={saving}
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50">
                {saving ? 'جاري الإضافة...' : 'إضافة الأخصائي'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
