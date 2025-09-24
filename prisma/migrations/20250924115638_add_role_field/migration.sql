/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
DROP INDEX [User_name_idx] ON [dbo].[User];

-- AlterTable
ALTER TABLE [dbo].[Transaction] DROP CONSTRAINT [Transaction_status_df];
ALTER TABLE [dbo].[Transaction] ADD CONSTRAINT [Transaction_status_df] DEFAULT 'PENDING' FOR [status];

-- AlterTable
ALTER TABLE [dbo].[User] DROP COLUMN [updatedAt];
ALTER TABLE [dbo].[User] ADD [role] NVARCHAR(1000) NOT NULL CONSTRAINT [User_role_df] DEFAULT 'USER';

-- CreateIndex
CREATE NONCLUSTERED INDEX [Transaction_createdAt_idx] ON [dbo].[Transaction]([createdAt]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
