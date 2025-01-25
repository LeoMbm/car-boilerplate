



# Refonte du site web de LM Motors


## Table des matières

- [Pré-requis](#pré-requis)
- [Installation](#installation)
- [Utilisation](#utilisation)



### Pré-requis

- Node.js 22
- Supabase
  - Base de données PostgreSQL
    - [Supabase PostgreSQL](https://supabase.com/docs/guides/database/postgres)
  - Storage de fichiers
    - [Supabase Storage](https://supabase.com/docs/guides/storage/storage)
    - Créer un bucket avec le nom `assets` et le type `public`

### Installation



Remplissez les variables d'environnement dans le fichier `.env` et installez les packages avec la commande suivante : 

```env
AUTH_SECRET="xxxxxxxxxxxxxx"
DATABASE_PASSWORD="xxxxxxxxxxx"
AUTH_TRUST_HOST=http://localhost:3000
SERVICE_ROLE_KEY="xxxxxxxxxxxxxxxxxxxxx"
SUPABASE_URL="https://xxxxxxxxxxxx.supabase.co"
DATABASE_URL="postgresql://xxxxxxxxx:xxxxxx@axxxxx.xxxx.supabase.com:5432/xxxxx"
DIRECT_URL="postgresql://xxxxxxxxx:xxxxxx@axxxxx.xxxx.supabase.com:5432/xxxxx"
ANON_PUBLIC_KEY="XXXXXXXXXXXXXXX"
```

```bash
pnpm install
pnpn dlx prisma migrate dev --name init
```


## Utilisation

```bash
pnpm run dev
```



> TODO:  CREATE MODEL FOR CARACHTERISITICS