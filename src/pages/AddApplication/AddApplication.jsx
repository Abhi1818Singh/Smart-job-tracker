import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { MdArrowBack, MdSave } from 'react-icons/md';
import useApplications from '../../hooks/useApplications';
import { STATUSES, PLATFORMS, LOC_TYPES } from '../../utils/helpers';
import './AddApplication.css';

/* ── Validation schema (yup) ── */
const schema = yup.object({
  company:      yup.string().required('Company name is required'),
  role:         yup.string().required('Job role is required'),
  appliedDate:  yup.string().required('Applied date is required'),
  location:     yup.string().required('Location type is required'),
  salary:       yup.number().typeError('Salary must be a number').min(0).optional().nullable(),
  platform:     yup.string().required('Platform is required'),
  status:       yup.string().required('Status is required'),
  interviewDate: yup.string().optional().nullable(),
  notes:        yup.string().max(500, 'Max 500 characters').optional(),
});

const FormField = ({ label, error, children }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    {children}
    {error && <span className="form-error">⚠ {error}</span>}
  </div>
);

const AddApplication = () => {
  const navigate = useNavigate();
  const { add }  = useApplications();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status:  'Applied',
      platform: 'LinkedIn',
      location: 'On-site',
      appliedDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data) => {
    add({ ...data, salary: data.salary || 0 });
    toast.success(`✓ Added ${data.company} — ${data.role}`);
    navigate('/applications');
  };

  return (
    <div className="add-app anim-fadeUp">
      {/* Header */}
      <div className="page-header">
        <div>
          <button className="btn-ghost back-btn" onClick={() => navigate(-1)}>
            <MdArrowBack size={16} /> Back
          </button>
          <h1 className="page-title" style={{ marginTop: 10 }}>Add Application</h1>
          <p className="page-subtitle">Track a new job opportunity</p>
        </div>
      </div>

      <div className="add-app-layout">
        <form className="card add-app-form" onSubmit={handleSubmit(onSubmit)}>

          {/* Row 1 */}
          <div className="grid-2">
            <FormField label="Company Name *" error={errors.company?.message}>
              <input className="form-input" placeholder="e.g. Google" {...register('company')} />
            </FormField>
            <FormField label="Job Role *" error={errors.role?.message}>
              <input className="form-input" placeholder="e.g. Frontend Engineer" {...register('role')} />
            </FormField>
          </div>

          {/* Row 2 */}
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

          {/* Row 3 */}
          <div className="grid-2">
            <FormField label="Location Type *" error={errors.location?.message}>
              <select className="form-input" {...register('location')}>
                {LOC_TYPES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </FormField>
            <FormField label="Salary (₹ per year)" error={errors.salary?.message}>
              <input
                className="form-input"
                type="number"
                placeholder="e.g. 1500000"
                {...register('salary')}
              />
            </FormField>
          </div>

          {/* Row 4 */}
          <div className="grid-2">
            <FormField label="Applied Date *" error={errors.appliedDate?.message}>
              <input className="form-input" type="date" {...register('appliedDate')} />
            </FormField>
            <FormField label="Interview Date" error={errors.interviewDate?.message}>
              <input className="form-input" type="date" {...register('interviewDate')} />
            </FormField>
          </div>

          {/* Notes */}
          <FormField label="Notes" error={errors.notes?.message}>
            <textarea
              className="form-input"
              placeholder="Any notes about this application…"
              rows={3}
              {...register('notes')}
            />
          </FormField>

          {/* Actions */}
          <div className="add-app-actions">
            <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              <MdSave size={15} />
              {isSubmitting ? 'Saving…' : 'Save Application'}
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="add-app-tips card">
          <h3 className="tips-title">💡 Tips</h3>
          <ul className="tips-list">
            <li>Add the exact job title from the posting</li>
            <li>Record the applied date right away so you don't forget</li>
            <li>Use the Notes field to track contact names or recruiter info</li>
            <li>Update status as your application progresses</li>
            <li>Bookmark high-priority roles to find them quickly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddApplication;
