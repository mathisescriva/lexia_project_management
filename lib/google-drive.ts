import { google } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/drive']

export class GoogleDriveService {
  private auth: any
  private drive: any

  constructor() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
      scopes: SCOPES,
    })
    this.drive = google.drive({ version: 'v3', auth: this.auth })
  }

  async createFolder(name: string, parentId?: string): Promise<{ id: string; url: string }> {
    const fileMetadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      ...(parentId && { parents: [parentId] }),
    }

    const file = await this.drive.files.create({
      requestBody: fileMetadata,
      fields: 'id,webViewLink',
    })

    return {
      id: file.data.id!,
      url: file.data.webViewLink!,
    }
  }

  async uploadFile(name: string, mimeType: string, content: Buffer, folderId?: string): Promise<{ id: string; url: string }> {
    const fileMetadata = {
      name,
      ...(folderId && { parents: [folderId] }),
    }

    const media = {
      mimeType,
      body: content,
    }

    const file = await this.drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id,webViewLink',
    })

    return {
      id: file.data.id!,
      url: file.data.webViewLink!,
    }
  }

  async listFiles(folderId: string): Promise<any[]> {
    const response = await this.drive.files.list({
      q: `'${folderId}' in parents`,
      fields: 'files(id,name,mimeType,size,webViewLink,createdTime)',
    })

    return response.data.files || []
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.drive.files.delete({
      fileId,
    })
  }

  async shareFile(fileId: string, email: string, role: 'reader' | 'writer' | 'owner' = 'reader'): Promise<void> {
    await this.drive.permissions.create({
      fileId,
      requestBody: {
        role,
        type: 'user',
        emailAddress: email,
      },
    })
  }
}

export const googleDriveService = new GoogleDriveService()
