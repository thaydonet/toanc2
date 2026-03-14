import { curriculumData, type Lesson } from './curriculum';

/**
 * Lấy tất cả bài học theo thứ tự (flatten toàn bộ volumes > chapters > lessons)
 */
export function getAllLessons(gradeSlug: string): Lesson[] {
    const curriculum = curriculumData[gradeSlug];
    if (!curriculum) return [];
    return curriculum.volumes.flatMap(vol =>
        vol.chapters.flatMap(chap => chap.lessons)
    );
}

/**
 * Tự động tìm bài trước và bài sau theo slug hiện tại
 * @param currentSlug - ví dụ: "lop8/bai-21-phan-thuc-dai-so"
 */
export function getPrevNextLesson(currentSlug: string): {
    prevLesson: { href: string; title: string } | undefined;
    nextLesson: { href: string; title: string } | undefined;
} {
    const gradeSlug = currentSlug.split('/')[0];
    const lessons = getAllLessons(gradeSlug);
    const href = '/' + currentSlug;
    const idx = lessons.findIndex(l => l.href === href);

    if (idx === -1) return { prevLesson: undefined, nextLesson: undefined };

    const prev = idx > 0 ? lessons[idx - 1] : undefined;
    const next = idx < lessons.length - 1 ? lessons[idx + 1] : undefined;

    return {
        prevLesson: prev ? { href: prev.href, title: prev.title } : undefined,
        nextLesson: next ? { href: next.href, title: next.title } : undefined,
    };
}
