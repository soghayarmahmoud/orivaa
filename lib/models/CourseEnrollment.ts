import mongoose, { Document, Schema } from 'mongoose';

export interface ICourseEnrollment extends Document {
  _id: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  status: 'pending' | 'enrolled' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const CourseEnrollmentSchema: Schema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'enrolled', 'cancelled'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

CourseEnrollmentSchema.index({ courseId: 1, email: 1 }, { unique: true });

export default mongoose.models.CourseEnrollment || mongoose.model<ICourseEnrollment>('CourseEnrollment', CourseEnrollmentSchema);
