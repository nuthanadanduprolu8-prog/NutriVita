import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Leaf, AlertCircle, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Register = () => {
  const { register, error: authError, clearError } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '24',
    gender: 'female',
    dietaryPreference: 'vegetarian',
    activityLevel: 'moderate',
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.age || Number(formData.age) < 1 || Number(formData.age) > 120) {
      errors.age = 'Please enter a valid age';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      age: Number(formData.age),
      gender: formData.gender,
      dietaryPreference: formData.dietaryPreference,
      activityLevel: formData.activityLevel,
    });
    setLoading(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mb-2">
            <Leaf className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {t('auth.registerTitle')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('auth.registerSubtitle')}
          </p>
        </div>

        {/* Card Form */}
        <Card className="shadow-lg border-slate-200/80">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error banner */}
            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <Input
              label={t('auth.fullName')}
              name="name"
              placeholder="e.g. Full Name"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
              required
            />

            <Input
              label={t('auth.email')}
              name="email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('auth.password')}
                name="password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                error={formErrors.password}
                required
              />

              <Input
                label={t('auth.confirmPassword')}
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={formErrors.confirmPassword}
                required
              />
            </div>

            {/* Profile Preferences */}
            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Nutrition Profile Setup
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('auth.age')}
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    min="1"
                    max="120"
                    required
                  />
                  {formErrors.age && <p className="text-xs text-rose-600 mt-1">{formErrors.age}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('auth.gender')}
                  </label>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('auth.dietaryPreference')}
                  </label>
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

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('auth.activityLevel')}
                  </label>
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
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                className="w-full font-semibold shadow-md"
              >
                <UserPlus className="w-4 h-4 mr-1.5" />
                <span>{t('auth.submitRegister')}</span>
              </Button>
            </div>
          </form>

          {/* Bottom Switcher */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>{t('auth.alreadyHaveAccount')} </span>
            <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
              {t('auth.signInHere')}
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Register;
