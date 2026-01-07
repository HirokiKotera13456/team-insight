export const LOGIN_COPY = {
  title: 'TeamInsight',
  subtitle: '仕事で迷いやすいポイントを、4つの軸で整理',
  description: '',
  features: [
    {
      icon: 'trendingUp',
      title: '4軸で整理する',
      description: '行動の速さ、判断の寄りどころ、進め方、視点。違いが出やすい4点に絞って見える化します。',
    },
    {
      icon: 'insights',
      title: '自分の"ひっかかり"が分かる',
      description: '決めるときに迷う場面や、ストレスが出やすいポイントを振り返りやすくします。',
    },
    {
      icon: 'checkCircle',
      title: '答えるだけでOK',
      description: '12問に直感で答えるだけ。あとから「なるほど」を言語化できるようにします。',
    },
  ],
  card: {
    title: 'まずは自分の傾向を見てみる',
    description: 'Googleアカウントでログインして、12問に答えるところから始めます。',
    button: 'Googleで続ける',
  },
  privacy: {
    title: '保存されるデータについて',
    description: '保存するのはスコア（0〜100）です。氏名など個人を特定する情報は最小限にします。',
  },
} as const;
