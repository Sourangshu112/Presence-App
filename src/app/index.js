import { View, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function TemporaryLogin() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, gap: 20 }}>
      <Button 
        title="Test Student Flow" 
        onPress={() => router.replace('/Students/Dashboard')} 
      />
      <Button 
        title="Test Teacher Flow" 
        onPress={() => router.replace('/Teachers/Dashboard')} 
      />
      <Button 
          title="🐛 Open Sitemap (Debug)" 
          color="purple"
          onPress={() => router.push('/_sitemap')} 
        />
    </View>
  );
}