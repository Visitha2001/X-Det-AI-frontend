// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'http://localhost:3000'

  return [
    {
      url: `${baseUrl}/home`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/chatbot`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/diseases`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/history`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/signin`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/home/results`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/admin/dashboard`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/admin/disease`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/admin/disease/add`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/admin/login`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/admin/newsletter`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/admin/review`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/admin/users`,
      lastModified: new Date()
    }
  ]
}