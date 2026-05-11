-- AlterTable
ALTER TABLE "Exercise" ALTER COLUMN "muscleGroups" DROP DEFAULT,
ALTER COLUMN "equipment" DROP DEFAULT,
ALTER COLUMN "exerciseTypes" DROP DEFAULT;

-- CreateTable
CREATE TABLE "RoutineSetConfig" (
    "id" TEXT NOT NULL,
    "routineExerciseId" TEXT NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "setType" "SetType" NOT NULL DEFAULT 'NORMAL',

    CONSTRAINT "RoutineSetConfig_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RoutineSetConfig" ADD CONSTRAINT "RoutineSetConfig_routineExerciseId_fkey" FOREIGN KEY ("routineExerciseId") REFERENCES "RoutineExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
