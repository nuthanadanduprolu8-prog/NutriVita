import React, { useState } from 'react';
import { User, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';
import { calculateAgeFromDob, getTodayDateString } from '../utils/dateUtils';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    dateOfBirth: user?.dateOfBirth || '',
    age: user?.age || 24,
    gender: user?.gender || 'female',
    dietaryPreference: user?.dietaryPreference || 'vegetarian',
    activityLevel: user?.activityLevel || 'moderate',
    languagePreference: user?.languagePreference || language || 'en',
  });

  const [dobError, setDobError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleDobChange = (e) => {
    const dobVal = e.target.value;
    setSuccessMessage('');
    setErrorMessage('');

    if (!dobVal) {
      setFormData((prev) => ({ ...prev, dateOfBirth: '', age: '' }));
      setDobError('');
      return;
    }

    const { age: calculatedAge, error } = calculateAgeFromDob(dobVal);

    if (error) {
      setFormData((prev) => ({ ...prev, dateOfBirth: dobVal, age: '' }));
      setDobError(error);
    } else {
      setFormData((prev) => ({ ...prev, dateOfBirth: dobVal, age: calculatedAge }));
      setDobError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    let targetAge = Number(formData.age);

    if (formData.dateOfBirth) {
      const { age: derivedAge, error } = calculateAgeFromDob(formData.dateOfBirth);
      if (error) {
        setDobError(error);
        return;
      }
      if (derivedAge !== null) {
        targetAge = derivedAge;
      }
    }

    if (!targetAge || targetAge < 1 || targetAge > 120) {
      setErrorMessage('Please provide a valid age (1-120).');
      return;
    }

    setLoading(true);

    const res = await updateProfile({
      name: formData.name,
      dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth : null,
      age: targetAge,
      gender: formData.gender,
      dietaryPreference: formData.dietaryPreference,
      activityLevel: formData.activityLevel,
      languagePreference: formData.languagePreference,
    });

    setLoading(false);
    if (res.success) {
      setSuccessMessage('Profile and dietary preferences updated successfully!');
      if (formData.languagePreference !== language) {
        setLanguage(formData.languagePreference);
      }
    } else {
      setErrorMessage(res.error || 'Failed to update profile.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Back Button */}
      <div className="pt-2">
        <BackButton fallbackPath="/dashboard" />
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('nav.profile')} & Preferences</h1>
        <p className="text-xs text-slate-500">Manage your nutritional baseline, dietary requirements, and account settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: User Summary Card */}
        <Card className="flex flex-col items-center text-center p-6 space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-emerald-500/20">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">{user?.name}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
          <div className="w-full pt-4 border-t border-slate-100 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Diet Type:</span>
              <span className="font-semibold text-slate-800 capitalize">{user?.dietaryPreference?.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Activity:</span>
              <span className="font-semibold text-slate-800 capitalize">{user?.activityLevel}</span>
            </div>
            {user?.dateOfBirth && (
              <div className="flex justify-between">
                <span className="text-slate-500">Born:</span>
                <span className="font-semibold text-slate-800">{user.dateOfBirth}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Age:</span>
              <span className="font-semibold text-slate-800">{user?.age} yrs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Nutrition Profile:</span>
              <span className="font-semibold text-emerald-600">Active</span>
            </div>
          </div>
        </Card>

        {/* Right Column: Edit Settings Form */}
        <Card className="md:col-span-2 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <span>{errorMessage}</span>
              </div>
            )}

            <Input
              label={t('auth.fullName')}
              name="name"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>{t('auth.dateOfBirth') || 'Date of Birth (DOB)'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">Auto-derives age</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  max={getTodayDateString()}
                  onChange={handleDobChange}
                  className={`block w-full rounded-xl border px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 bg-white transition-all ${
                    dobError ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-emerald-500'
                  }`}
                />
                {dobError && (
                  <p className="text-xs text-rose-600 mt-1">{dobError}</p>
                )}
                {formData.dateOfBirth && !dobError && (
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">
                    ✓ {t('auth.autoCalculatedFromDob') || 'Auto-calculated from Date of Birth'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>{t('auth.calculatedAge') || t('auth.age') || 'Age'}</span>
                  {formData.dateOfBirth && (
                    <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">Derived</span>
                  )}
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  readOnly={!!formData.dateOfBirth}
                  placeholder="e.g. 25"
                  className={`block w-full rounded-xl border px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 ${
                    formData.dateOfBirth ? 'bg-slate-50 text-slate-700 font-semibold cursor-not-allowed border-slate-200' : 'bg-white border-slate-300'
                  }`}
                  min="1"
                  max="120"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('auth.gender')}</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="female">{t('auth.female')}</option>
                  <option value="male">{t('auth.male')}</option>
                  <option value="other">{t('auth.other')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('auth.dietaryPreference')}</label>
                <select
                  name="dietaryPreference"
                  value={formData.dietaryPreference}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="vegetarian">{t('auth.vegetarian')}</option>
                  <option value="vegan">{t('auth.vegan')}</option>
                  <option value="non_vegetarian">{t('auth.nonVegetarian')}</option>
                  <option value="eggetarian">{t('auth.eggetarian')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('auth.activityLevel')}</label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="sedentary">{t('auth.sedentary')}</option>
                  <option value="light">{t('auth.light')}</option>
                  <option value="moderate">{t('auth.moderate')}</option>
                  <option value="active">{t('auth.active')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred Interface Language</label>
                <select
                  name="languagePreference"
                  value={formData.languagePreference}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="en">English (ఇంగ్లీష్)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                </select>
              </div>
            </div>

            <div className="pt-3">
              <Button type="submit" variant="primary" size="md" loading={loading} className="w-full sm:w-auto font-semibold">
                <Save className="w-4 h-4 mr-1.5" />
                <span>{t('common.save')}</span>
              </Button>
            </div>
          </form>
        </Card>

      </div>
    </div>
  );
};

export default Profile;
