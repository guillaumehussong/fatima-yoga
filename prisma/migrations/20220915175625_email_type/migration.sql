-- AlterTable
ALTER TABLE `email_message` MODIFY `type` ENUM('SESSION_CANCELED', 'SESSION_REMINDER_NEWCOMER', 'SESSION_REGISTRATION', 'OTHER') NOT NULL;
