# Tpl APP 👋

The template APP built based on Expo, Antd Mobile and SupaBase has a built-in login and registration function, which can be used with simple configuration.

requirements:

- Node.js v16+

## Get started

1. Install dependencies

```bash
npm install
```

2. modify config file **/config.ts**

```ts
export const supabaseUrl = 'YOUR_SUPABASE_URL';
export const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
```

3. launch app

```bash
npm run [ios | android | web]
```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Supabase](https://supabase.com)
- [Antd Mobile](http://rn.mobile.ant.design/docs/react/introduce-cn)

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).