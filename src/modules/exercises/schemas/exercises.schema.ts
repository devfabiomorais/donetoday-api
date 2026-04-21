import { z } from 'zod'

const muscleGroupEnum = z.enum(['UPPER_BACK', 'LOWER_BACK', 'LATISSIMUS', 'SIDE_SHOULDERS', 'FRONT_SHOULDERS', 'REAR_SHOULDERS', 'ROTATOR_CUFF', 'SHOULDERS', 'CHEST', 'UPPER_CHEST', 'LOWER_CHEST', 'TRICEPS', 'BICEPS', 'FOREARMS', 'HAND_MUSCLES', 'GRIP_MUSCLES', 'TRAPEZIUS', 'NECK', 'JAW', 'ABDOMINALS', 'OBLIQUES', 'SERRATUS', 'DEEP_CORE', 'GLUTES', 'HAMSTRINGS', 'QUADRICEPS', 'ABDUCTORS', 'ADDUCTORS', 'HIP_FLEXORS', 'HIPS', 'CALVES', 'TIBIALIS_ANTERIOR', 'FEET'])

const equipmentEnum = z.enum(['TRX', 'GYMNASTIC_RINGS', 'PARALLETTES', 'RESISTANCE_BANDS', 'RESISTANCE_TUBES', 'JUMP_ROPE', 'TIRE', 'AB_WHEEL', 'WEIGHTED_VEST', 'DUMBBELL', 'KETTLEBELL', 'BARBELL', 'WEIGHT_PLATES', 'MEDICINE_BALL', 'BALL', 'SLAM_BALL', 'BULGARIAN_BAG', 'SANDBAG', 'BATTLE_ROPE', 'GRIP_STRENGTHENERS', 'ANKLE_WRIST_WEIGHTS', 'PORTABLE_STEP_PLATFORM', 'AGILITY_LADDER', 'CONES', 'PUNCHING_BAG', 'FREESTANDING_PUNCHING_BAG', 'SPEED_BAG', 'DOUBLE_END_BAG', 'FOCUS_MITTS', 'THAI_PADS', 'BOXING_GLOVES', 'MMA_GLOVES', 'HAND_WRAPS', 'SHIN_GUARDS', 'HEADGEAR', 'MOUTHGUARD', 'OTHER', 'NO_EQUIPMENT'])

const exerciseTypeEnum = z.enum(['STRENGTH', 'ENDURANCE', 'HYPERTROPHY', 'POWER', 'FLEXIBILITY', 'MOBILITY', 'STABILITY', 'BALANCE', 'COORDINATION', 'SPEED', 'AGILITY', 'EXPLOSIVENESS', 'CORE', 'FUNCTIONAL', 'CARDIOVASCULAR', 'AEROBIC', 'HIIT', 'PLYOMETRICS', 'FIGHT', 'REFLEX', 'MATH', 'OTHER'])

export const createExerciseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  muscleGroups: z.array(muscleGroupEnum).min(1, 'At least one muscle group is required'),
  equipment: z.array(equipmentEnum).optional(),
  exerciseTypes: z.array(exerciseTypeEnum).min(1, 'At least one exercise type is required'),
  metricType: z.enum(['REPS', 'WEIGHT_REPS', 'TIME', 'WEIGHT_TIME', 'WEIGHT_REPS_TIME']),
  imageUrl: z.url('Invalid image URL').optional(),
  videoUrl: z.url('Invalid video URL').optional(),
})

export const updateExerciseSchema = createExerciseSchema.partial()