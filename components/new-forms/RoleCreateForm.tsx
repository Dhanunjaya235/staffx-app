import React from 'react';
import Button from '../UI/Button/Button';
import Dropdown from '../UI/Dropdown/Dropdown';

interface RoleCreateFormProps {
  onRoleCreated: (role: any) => void;
}

const RoleCreateForm: React.FC<RoleCreateFormProps> = ({ onRoleCreated }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    department: '',
    level: '',
    skillsRequired: '',
    experienceMin: '',
    experienceMax: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRole = {
      id: Date.now().toString(),
      ...formData,
      skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()),
      experienceMin: parseInt(formData.experienceMin),
      experienceMax: parseInt(formData.experienceMax),
      createdAt: new Date().toISOString().split('T')[0]
    };
    onRoleCreated(newRole);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
        <Dropdown
          options={['Entry', 'Mid', 'Senior', 'Lead', 'Manager', 'Director']}
          value={formData.level}
          onChange={(value) => setFormData({ ...formData, level: value as string })}
          placeholder="Select Level"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
        <input
          type="text"
          name="skillsRequired"
          value={formData.skillsRequired}
          onChange={handleChange}
          placeholder="React, TypeScript, Node.js"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Min Experience (years)</label>
          <input
            type="number"
            name="experienceMin"
            value={formData.experienceMin}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Experience (years)</label>
          <input
            type="number"
            name="experienceMax"
            value={formData.experienceMax}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" variant="primary">Add Role</Button>
      </div>
    </form>
  );
};

export default RoleCreateForm;


