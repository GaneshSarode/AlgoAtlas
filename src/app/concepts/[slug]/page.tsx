"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Code,
  AlertTriangle,
  FolderCode,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { PrerequisiteGraph } from "@/components/concepts/PrerequisiteGraph";
import { DETAILED_CONCEPTS } from "@/services/conceptData";
import { getDbRepository } from "@/lib/db/repository";
import type { Topic, TopicMastery, Problem } from "@/types";

export default function ConceptDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [, setTopic] = useState<Topic | null>(null);
  const [mastery, setMastery] = useState<TopicMastery | null>(null);
  const [masteryMap, setMasteryMap] = useState<Map<string, TopicMastery>>(new Map());
  const [relatedProblems, setRelatedProblems] = useState<Problem[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [, setIsLoading] = useState(true);

  const detailed = DETAILED_CONCEPTS[slug] || {
    id: `t-${slug}`,
    slug,
    name: slug.replace(/-/g, " "),
    category: "Algorithms & Patterns",
    definition: "Core computational pattern designed for algorithmic problem solving.",
    intuition: "Transform input data into an optimal structure to answer queries or minimize steps.",
    howItWorks: "Evaluates inputs systematically to avoid redundant computation.",
    whenToUse: ["When looking for optimal substructure or sorted monotonic properties."],
    whenNotToUse: ["When input scale renders the complexity sub-optimal."],
    timeComplexity: "O(N) to O(N log N)",
    spaceComplexity: "O(1) to O(N)",
    codeTemplate: `// Standard template for ${slug}\n`,
    language: "C++",
    commonMistakes: ["Boundary errors", "Off-by-one pointer index mistakes"],
    prerequisites: ["arrays"],
    unlockedConcepts: [],
  };

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const repo = getDbRepository();
      const t = await repo.getTopicBySlug(slug);
      setTopic(t);

      const allMastery = await repo.getTopicMastery();
      const map = new Map<string, TopicMastery>();
      allMastery.forEach((m) => {
        if (m.topic_name) map.set(m.topic_name.toLowerCase().replace(/[\s&]+/g, "-"), m);
      });
      setMasteryMap(map);

      if (t) {
        const foundMastery = allMastery.find((m) => m.topic_id === t.id);
        setMastery(foundMastery || null);
      }

      // Load related problems from vault
      const problems = await repo.getProblems();
      const matched = problems.filter(
        (p) =>
          p.primary_topic?.toLowerCase() === detailed.name.toLowerCase() ||
          p.primary_topic?.toLowerCase().replace(/[\s&]+/g, "-") === slug
      );
      setRelatedProblems(matched);

      setIsLoading(false);
    }
    loadData();
  }, [slug, detailed.name]);

  const handleCopy = () => {
    navigator.clipboard.writeText(detailed.codeTemplate);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back and Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/concepts"
            className="p-2 rounded-lg bg-[#141414] border border-[#232323] text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                {detailed.category}
              </span>
              {mastery && (
                <Badge variant="outline">{mastery.learning_status}</Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white capitalize mt-0.5">
              {detailed.name}
            </h1>
          </div>
        </div>

        <div className="text-xs text-neutral-400">
          <strong className="text-emerald-400 font-semibold">{relatedProblems.length}</strong> problems logged in vault
        </div>
      </div>

      {/* Prerequisite Flow Graph */}
      <PrerequisiteGraph
        currentSlug={slug}
        prerequisites={detailed.prerequisites}
        unlockedConcepts={detailed.unlockedConcepts}
        masteryMap={masteryMap}
      />

      {/* Definition & Mental Model */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-[#232323] bg-[#141414]">
          <CardHeader className="py-3 px-4 border-b border-[#232323]">
            <CardTitle className="text-sm text-white">Definition & Core Concept</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <p className="text-xs text-neutral-300 leading-relaxed">
              {detailed.definition}
            </p>
            <div className="pt-2 border-t border-[#232323]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                How It Works:
              </span>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {detailed.howItWorks}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#232323] bg-[#141414]">
          <CardHeader className="py-3 px-4 border-b border-[#232323]">
            <CardTitle className="text-sm text-white">Intuition & Mental Model</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <p className="text-xs text-neutral-200 italic bg-[#181818] border border-[#262626] p-3 rounded-lg leading-relaxed">
              "{detailed.intuition}"
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-[#181818] border border-[#262626]">
                <span className="text-[10px] text-neutral-400 block font-semibold">Time Complexity</span>
                <span className="font-mono text-emerald-400 text-xs">{detailed.timeComplexity}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#181818] border border-[#262626]">
                <span className="text-[10px] text-neutral-400 block font-semibold">Space Complexity</span>
                <span className="font-mono text-neutral-300 text-xs">{detailed.spaceComplexity}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* When to Use vs When Not to Use */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-emerald-900/30 bg-[#141414]">
          <CardHeader className="py-3 px-4 bg-emerald-950/20 border-b border-emerald-900/30">
            <CardTitle className="text-sm text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> When to Use
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {detailed.whenToUse.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                <span className="text-emerald-400 font-bold shrink-0">•</span>
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-rose-900/30 bg-[#141414]">
          <CardHeader className="py-3 px-4 bg-rose-950/20 border-b border-rose-900/30">
            <CardTitle className="text-sm text-rose-400 flex items-center gap-1.5">
              <XCircle className="w-4 h-4" /> When NOT to Use / Traps
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {detailed.whenNotToUse.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                <span className="text-rose-400 font-bold shrink-0">•</span>
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Code Template */}
      <Card className="border-[#232323] bg-[#141414]">
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b border-[#232323]">
          <CardTitle className="text-sm flex items-center gap-2 text-white">
            <Code className="w-4 h-4 text-neutral-400" />
            Standard Code Template ({detailed.language})
          </CardTitle>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="text-xs h-7 px-2.5 gap-1.5 border-[#262626] text-neutral-300 hover:text-white hover:bg-[#181818]"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Template</span>
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <pre className="p-4 bg-[#0e0e0e] text-neutral-200 text-xs font-mono overflow-x-auto leading-relaxed border-t border-[#232323]">
            <code>{detailed.codeTemplate}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Common Mistakes */}
      {detailed.commonMistakes && detailed.commonMistakes.length > 0 && (
        <Card className="border-amber-900/40 bg-[#141414]">
          <CardHeader className="py-3 px-4 bg-amber-950/20 border-b border-amber-900/30">
            <CardTitle className="text-sm text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Common Mistakes & Gotchas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {detailed.commonMistakes.map((m, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                <span className="text-amber-400 font-bold shrink-0">⚠</span>
                <span>{m}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Related Problems in Vault */}
      <Card className="border-[#232323] bg-[#141414]">
        <CardHeader className="py-3 px-4 border-b border-[#232323]">
          <CardTitle className="text-sm flex items-center gap-2 text-white">
            <FolderCode className="w-4 h-4 text-neutral-400" />
            Problems in Your Vault for "{detailed.name}" ({relatedProblems.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {relatedProblems.length === 0 ? (
            <p className="text-xs text-neutral-500 py-3 text-center">
              No problems logged under this topic yet. Add questions to your vault to track mastery.
            </p>
          ) : (
            <div className="divide-y divide-[#232323]">
              {relatedProblems.map((p) => (
                <div
                  key={p.id}
                  className="py-2.5 flex items-center justify-between text-xs hover:bg-[#181818] px-2 rounded transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-neutral-400">{p.platform}</span>
                    <Link
                      href={`/problems/${p.id}`}
                      className="font-semibold text-white hover:text-neutral-300 transition-colors"
                    >
                      {p.title}
                    </Link>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        p.difficulty === "Easy"
                          ? "success"
                          : p.difficulty === "Medium"
                          ? "warning"
                          : "danger"
                      }
                    >
                      {p.difficulty}
                    </Badge>
                    <span className="text-amber-400">{"★".repeat(p.confidence_rating)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
