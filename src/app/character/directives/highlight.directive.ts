import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, AfterViewInit, NgZone } from '@angular/core';

/**
 * Highlight Directive
 *
 * Highlights text within an element when it matches a search term.
 *
 * Usage:
 * ```html
 * <p [appHighlight]="searchTerm">This is some text that might contain the search term</p>
 * ```
 *
 * The directive will wrap matching text in a span with class 'highlight',
 * which you can style with CSS:
 *
 * ```css
 * .highlight {
 *   background-color: yellow;
 *   font-weight: bold;
 * }
 * ```
 */
@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnChanges, AfterViewInit {
  @Input() appHighlight: string = '';
  @Input() highlightClass: string = 'highlight';

  private textContent: string = '';
  private hasBeenHighlighted = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private zone: NgZone
  ) {}

  ngAfterViewInit(): void {
    // Dar un tiempo para que el contenido se renderice completamente
    setTimeout(() => {
      // Capturar el contenido de texto original
      this.updateOriginalText();

      // Aplicar el resaltado si hay un término de búsqueda
      if (this.appHighlight && this.appHighlight.trim() !== '') {
        this.applyHighlight();
      }
    }, 100); // Un pequeño delay para asegurar que el DOM está completamente renderizado
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si cambia el término de búsqueda o la clase, aplicar el resaltado
    if (changes['appHighlight'] || changes['highlightClass']) {
      // Primero, restablecer al contenido original si ya se ha resaltado
      this.resetToOriginal();

      // Si no hay término de búsqueda, no hacer nada más
      if (!this.appHighlight || this.appHighlight.trim() === '') {
        return;
      }

      // Luego, actualizar el texto original (por si ha cambiado)
      setTimeout(() => {
        this.updateOriginalText();

        // Aplicar el resaltado
        this.applyHighlight();
      }, 50);
    }
  }

  private updateOriginalText(): void {
    // Asegurarnos de obtener el texto real, no el HTML, para evitar problemas con los tags
    const content = this.el.nativeElement.textContent;
    if (content && content.trim() !== '') {
      this.textContent = content.trim();
    }
  }

  private resetToOriginal(): void {
    // Solo restaurar si ya se ha aplicado un resaltado
    if (this.hasBeenHighlighted) {
      this.renderer.setProperty(this.el.nativeElement, 'textContent', this.textContent);
      this.hasBeenHighlighted = false;
    }
  }

  /**
   * Aplica el resaltado al texto que coincide con el término de búsqueda
   */
  private applyHighlight(): void {
    // Usar NgZone para ejecutar fuera de la zona y evitar ciclos de detección adicionales
    this.zone.runOutsideAngular(() => {
      if (!this.textContent || !this.appHighlight) {
        console.log('Highlight: Missing content or search term', {
          content: !!this.textContent,
          term: this.appHighlight
        });
        return;
      }

      console.log('Applying highlight:', {
        content: this.textContent,
        term: this.appHighlight
      });

      // Escapar caracteres especiales de regex en el término de búsqueda
      const escapedTerm = this.appHighlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

      // Crear la expresión regular con case-insensitive
      const regex = new RegExp(`(${escapedTerm})`, 'gi');

      // Verificar si hay coincidencias
      if (!regex.test(this.textContent)) {
        console.log('No matches found for:', this.appHighlight);
        // No hay coincidencias, mantener el texto original
        this.resetToOriginal();
        return;
      }

      console.log('Matches found, applying highlight');

      // Crear un nuevo elemento span para el contenido resaltado
      const span = this.renderer.createElement('span');

      // Reemplazar las coincidencias con spans resaltados
      const highlightedText = this.textContent.replace(regex, `<span class="${this.highlightClass}">$1</span>`);

      // Establecer el HTML
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', highlightedText);
      this.hasBeenHighlighted = true;
    });
  }
} 
