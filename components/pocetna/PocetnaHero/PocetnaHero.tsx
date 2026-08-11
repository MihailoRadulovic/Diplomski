import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/hooks/useT";
import { SERIF_BOLD, SERIF_REGULAR } from "@/lib/constants/fontovi";

export function PocetnaHero() {
  const t = useT("pocetna");
  const { korisnik, ucitava, ime } = useAuth();

  const imeCapitalized = ime ? ime.charAt(0).toUpperCase() + ime.slice(1) : "";

  return (
    <View>
      {/* Hero band sa bojom pozadine i dekorativnim elementom */}
      <View className="bg-[#EAF3DE] dark:bg-[#111E08] overflow-hidden px-4 pt-8 pb-2 gap-4">
        {/* Dekorativni listovi — tri sloja */}
        <View
          className="absolute -right-8 -top-8"
          style={{ opacity: 0.1 }}
          pointerEvents="none"
        >
          <Ionicons name="leaf" size={200} color="#27500A" />
        </View>
        <View
          className="absolute -left-4 bottom-0"
          style={{ opacity: 0.07, transform: [{ rotate: "140deg" }] }}
          pointerEvents="none"
        >
          <Ionicons name="leaf" size={130} color="#27500A" />
        </View>

        {/* Personalizovani pozdrav */}
        {!ucitava && korisnik && imeCapitalized && (
          <View className="flex-row items-center gap-2 self-start px-3 py-1 rounded-full bg-white/60 dark:bg-[#1A2E0D]/60 border border-[#C5DFA0] dark:border-[#2D4A1A]">
            <Text className="text-sm">👋</Text>
            <Text
              className="text-sm font-medium text-[#4A7A20] dark:text-[#A8D878]"
              style={{ fontFamily: SERIF_REGULAR }}
            >
              {t("pozdrav", { ime: imeCapitalized })}
            </Text>
          </View>
        )}

        {/* Naslov i podnaslov */}
        <View className="gap-1.5">
          {/* Botanicki badge */}
          <View className="flex-row items-center gap-1.5 self-start mb-1 px-2.5 py-1 rounded-full bg-[#C5E89A]/50 dark:bg-[#2A4A12]/50 border border-[#A5D870]/50 dark:border-[#3A6020]/50">
            <Text style={{ fontSize: 11 }}>🌿</Text>
            <Text
              className="text-[#3D6612] dark:text-[#9DC870]"
              style={{
                fontFamily: SERIF_BOLD,
                fontSize: 10,
                letterSpacing: 0.8,
                textTransform: "uppercase",
              }}
            >
              {t("badge")}
            </Text>
          </View>
          <Text
            className="text-4xl text-zinc-900 dark:text-white leading-tight"
            style={{ fontFamily: SERIF_BOLD }}
          >
            {t("naslov")}
          </Text>
          <Text
            className="text-base text-[#4A6B2A] dark:text-[#9DC870] max-w-xs"
            style={{ fontFamily: SERIF_REGULAR }}
          >
            {t("podnaslov")}
          </Text>
        </View>

        {/* Primarni CTA */}
        <Pressable
          onPress={() => router.push("/(tabs)/prepoznavanje" as never)}
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          className="w-full mt-2 py-3.5 rounded-xl bg-[#639922] items-center flex-row justify-center gap-2"
          accessibilityRole="button"
        >
          <Ionicons name="camera-outline" size={16} color="white" />
          <Text
            className="text-white font-semibold text-base"
            style={{ fontFamily: SERIF_BOLD }}
          >
            {t("poziv_prepoznavanje")}
          </Text>
        </Pressable>
      </View>

      {/* Sekundarni CTA — ispod obojene trake */}
      <View className="flex-row px-4 pb-4 gap-3">
        <Pressable
          onPress={() => router.push("/(tabs)/pretraga" as never)}
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          className="flex-1 py-2.5 rounded-xl bg-[#D4EDAA] dark:bg-[#1A3A0A] items-center flex-row justify-center gap-2"
          accessibilityRole="button"
        >
          <Ionicons name="search" size={17} color="#3D6612" />
          <Text
            className="text-[#3D6612] dark:text-[#C8E6A0] font-semibold text-sm"
            style={{ fontFamily: SERIF_BOLD }}
          >
            {t("poziv")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
