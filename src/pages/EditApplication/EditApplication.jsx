import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { MdArrowBack, MdSave, MdDelete } from 'react-icons/md';
import useApplications from '../../hooks/useApplications';
import { STATUSES, PLATFORMS, LOC_TYPES } from '../../utils/helpers';
import './EditApplication.css';

const schema = yup.object({
  company:       yup.string().required('Company name is required'),
  role:          yup.string().required('Job role is required'),
  appliedDate:   yup.string().required('Applied date is required'),
  location:      yup.string().required('Location type is required'),
  salary:        yup.number().typeError('Must be a number').min(0).optional().nullable(),
  platform:      yup.string().required('Platform is required'),
  status:        yup.string().required('Status is required'),
  interviewDate: yup.string().optional().nullable(),
  notes:         yup.string().max(500).optional(),
});

const FormField = ({ label, error, children }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    {children}
    {error && <span className="form-error">⚠ {error}</span>}
  </div>
);

const EditApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apps, update, remove } = useApplications();

  const app = apps.find((a) => a.id === id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (app) reset(app);
  }, [app, reset]);

  if (!app) {
    return (
      <div className="loading-wrap">
        <p style={{ color: 'var(--text-muted)' }}>Application not found.</p>
        <button className="btn-primary" onClick={() => navigate('/applications')}>
          Back to Applications
        </button>
      </div>
    );
  }

  const onSubmit = (data) => {
    update(id, { ...data, salary: data.salary || 0 });
    toast.success(`✓ Updated ${data.company}`);
    navigate('/applications');
  };

  const handleDelete = () => {
    remove(id);
    toast.success('Application deleted');
    navigate('/applications');
  };

  return (
    <div className="edit-app anim-fadeUp">
      <div className="page-header">
        <div>
          <button className="btn-ghost back-btn" onClick={() => navigate(-1)}>
            <MdArrowBack size={16} /> Back
          </button>
          <h1 className="page-title" style={{ marginTop: 10 }}>Edit Application</h1>
          <p className="page-subtitle">{app.company} — {app.role}</p>
        </div>
        <button className="btn-danger" onClick={handleDelete}>
          <MdDelete size={15} /> Delete
        </button>
      </div>

      <form className="card edit-app-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid-2">
          <FormField label="Company Name *" error={errors.company?.message}>
            <input className="form-input" {...register('company')} />
          </FormField>
          <FormField label="Job Role *" error={errors.role?.message}>
            <input className="form-input" {...register('role')} />
          </FormField>
        </div>

        <div className="grid-2">
          <FormField label="Status *" error={errors.status?.message}>
            <select className="form-input" {...register('status')}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="Platform *" error={errors.platform?.message}>
            <select className="form-input" {...register('platform')}>
              {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </FormField>
        </div>

        <div className="grid-2">
          <FormField label="Location Type *" error={errors.location?.message}>
            <select className="form-input" {...register('location')}>
              {LOC_TYPES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </FormField>
          <FormField label="Salary (₹ per year)" error={errors.salary?.message}>
            <input className="form-input" type="number" {...register('salary')} />
          </FormField>
        </div>

        <div className="grid-2">
          <FormField label="Applied Date *" error={errors.appliedDate?.message}>
            <input className="form-input" type="date" {...register('appliedDate')} />
          </FormField>
          <FormField label="Interview Date" error={errors.interviewDate?.message}>
            <input className="form-input" type="date" {...register('interviewDate')} />
          </FormField>
        </div>

        <FormField label="Notes" error={errors.notes?.message}>
          <textarea className="form-input" rows={3} {...register('notes')} />
        </FormField>

        <div className="edit-app-actions">
          <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting || !isDirty}>
            <MdSave size={15} />
            {isSubmitting ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditApplication;
