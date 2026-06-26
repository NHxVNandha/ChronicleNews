namespace Chronicle.Infrastructure.Persistence.Seed;

public static class SeedIds
{
    public static class Roles
    {
        public static readonly Guid Admin = Guid.Parse("a1111111-1111-1111-1111-111111111111");
        public static readonly Guid Editor = Guid.Parse("a2222222-2222-2222-2222-222222222222");
        public static readonly Guid Author = Guid.Parse("a3333333-3333-3333-3333-333333333333");
        public static readonly Guid Reviewer = Guid.Parse("a4444444-4444-4444-4444-444444444444");
    }

    public static class Users
    {
        public static readonly Guid Admin = Guid.Parse("b1111111-1111-1111-1111-111111111111");
        public static readonly Guid Editor = Guid.Parse("b2222222-2222-2222-2222-222222222222");
        public static readonly Guid Author = Guid.Parse("b3333333-3333-3333-3333-333333333333");
        public static readonly Guid Reviewer = Guid.Parse("b4444444-4444-4444-4444-444444444444");
    }

    public static class Categories
    {
        public static readonly Guid Technology = Guid.Parse("c1111111-1111-1111-1111-111111111111");
        public static readonly Guid Education = Guid.Parse("c2222222-2222-2222-2222-222222222222");
        public static readonly Guid Health = Guid.Parse("c3333333-3333-3333-3333-333333333333");
        public static readonly Guid PoliticsAndPolicy = Guid.Parse("c4444444-4444-4444-4444-444444444444");
    }

    public static class Articles
    {
        public static readonly Guid ArchitectureOfTruth = Guid.Parse("d1111111-1111-1111-1111-111111111111");
        public static readonly Guid SovereignGrid = Guid.Parse("d2222222-2222-2222-2222-222222222222");
        public static readonly Guid CampusReimagined = Guid.Parse("d3333333-3333-3333-3333-333333333333");
        public static readonly Guid RedIndex = Guid.Parse("d4444444-4444-4444-4444-444444444444");
        public static readonly Guid GeneticResilience = Guid.Parse("d5555555-5555-5555-5555-555555555555");
        public static readonly Guid TruthMachine = Guid.Parse("d6666666-6666-6666-6666-666666666666");
    }
}
