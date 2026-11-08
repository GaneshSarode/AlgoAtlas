"use client";

import React, { useState, useEffect } from "react";
import { BrainCircuit, Search, Sparkles } from "lucide-react";
import { ConceptCard } from "@/components/concepts/ConceptCard";
import { getDbRepository } from "@/lib/db/repository";
import type { Topic, TopicMastery, ConceptCategory } from "@/types";

export default function ConceptVaultPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [masteryList, setMasteryList] = useState<TopicMastery[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const repo = getDbRepository();
      const t = await repo.getTopics();
      const m = await repo.getTopicMastery();
      setTopics(t);
      setMasteryList(m);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const categories = ["All", "Fundamentals", "Data Structures", "Algorithms & Patterns"];

  const masteryMap = new Map(masteryList.map((m) => [m.topic_id, m]));

  const filteredTopics = topics.filter((t) => {
    if (selectedCategory !== "All" && t.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <BrainCircuit className="w-6 h-6 text-purple-400" />
          Concept Vault — Personal DSA Knowledge Base
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Study definitions, algorithmic intuitions, code templates, when-to-use criteria, and prerequisite flows.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#12141d] border border-[#1f2433] rounded-xl p-3.5">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                selectedCategory === cat
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-[#181b26] text-gray-400 hover:text-white border border-[#272f44]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts or patterns..."
            className="w-full bg-[#181b26] border border-[#272f44] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Grid of Concept Cards */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-gray-500 animate-pulse">
          Loading concepts...
        </div>
      ) : filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic) => (
            <ConceptCard
              key={topic.id}
              topic={topic}
              mastery={masteryMap.get(topic.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-[#12141d] rounded-xl border border-[#23293a] text-xs text-gray-400">
          No concepts matched your search.
        </div>
      )}
    </div>
  );
}
